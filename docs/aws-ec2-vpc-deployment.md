# Despliegue en AWS Academy con EC2 y VPC

Esta guía describe un despliegue simple para IronFeed usando dos instancias EC2 dentro de una VPC:

- Una instancia pública para Angular SSR y Nginx.
- Una instancia privada para PostgreSQL, microservicios Spring Boot y API Gateway.

La arquitectura mantiene el desarrollo local intacto y usa archivos específicos para AWS cuando corresponde.

## Arquitectura

```text
Internet
  |
  v
EC2 pública / subnet pública
  - Nginx :80
  - Angular SSR / Node :4000
  - /api/** -> http://IP_PRIVADA_BACKEND:8080
  |
  v
EC2 privada / subnet privada
  - docker compose -f docker-compose.aws.yml up -d --build
  - api-gateway :8080
  - users-ms :8081
  - workout-ms :8082
  - social-ms :8083
  - posts-ms :8084
  - postgres :5432
```

## Cambios de configuración incluidos

### Desarrollo local

El frontend conserva `http://localhost:8080` para `ng serve` mediante `src/environments/environment.development.ts`.

```bash
cd IronFeed-Frontend
npm start
```

El backend local puede seguir usando el Compose de desarrollo:

```bash
docker compose up -d --build
```

### Producción/AWS

El frontend de producción usa `apiGatewayUrl: ''`, por lo que llama a rutas relativas como `/api/posts`. Nginx recibe esas rutas en la EC2 pública y las reenvía a la EC2 privada.

El backend en AWS usa `docker-compose.aws.yml`, que publica únicamente el API Gateway en el host privado:

```bash
docker compose -f docker-compose.aws.yml up -d --build
```

Los microservicios usan el perfil `docker,prod`. El perfil `prod` evita `create-drop`, desactiva la ejecución automática de `data.sql` y desactiva `show-sql`.

## 1. Crear la VPC

Crear una VPC:

```text
Nombre: ironfeed-vpc
CIDR: 10.0.0.0/16
```

Crear dos subnets:

```text
ironfeed-public-subnet   10.0.1.0/24
ironfeed-private-subnet  10.0.2.0/24
```

Crear y adjuntar un Internet Gateway:

```text
Nombre: ironfeed-igw
VPC: ironfeed-vpc
```

Crear una route table pública con:

```text
0.0.0.0/0 -> ironfeed-igw
```

Asociar esa route table solamente a `ironfeed-public-subnet`.

La subnet privada puede mantener solo la ruta local de la VPC. Si necesitas instalar paquetes o descargar imágenes desde la privada, usa NAT Gateway temporal, una instancia pública como bastion/proxy, o prepara la instancia antes de quitarle salida pública.

## 2. Security Groups

### Frontend público

Inbound:

| Puerto | Origen | Uso |
|---:|---|---|
| 80 | 0.0.0.0/0 | HTTP público |
| 443 | 0.0.0.0/0 | HTTPS si se configura TLS |
| 22 | Tu IP | SSH administrativo |

Outbound: permitir tráfico saliente.

### Backend privado

Inbound:

| Puerto | Origen | Uso |
|---:|---|---|
| 8080 | Security Group del frontend | API Gateway |
| 22 | Security Group del frontend | SSH vía bastion, si aplica |

No abrir `8081`, `8082`, `8083`, `8084` ni `5432` a Internet. Los microservicios y PostgreSQL se comunican por la red interna de Docker Compose.

## 3. Instancia privada: backend

Instalar dependencias:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker ubuntu
```

Cerrar sesión y volver a entrar para aplicar el grupo `docker`.

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd IronFeed-Microservices
```

Crear variables de entorno:

```bash
cp .env.example .env
nano .env
```

Configurar un secreto real de al menos 32 caracteres:

```env
JWT_SECRET=pon-una-clave-real-de-mas-de-32-caracteres
```

Levantar backend:

```bash
docker compose -f docker-compose.aws.yml up -d --build
```

Verificar:

```bash
docker ps
curl http://localhost:8080/actuator/health
```

## 4. Instancia pública: frontend SSR

Instalar dependencias:

```bash
sudo apt update
sudo apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Clonar y compilar:

```bash
git clone <URL_DEL_REPOSITORIO>
cd IronFeed-Microservices/IronFeed-Frontend
npm ci
npm run build
```

Ejecutar SSR con PM2:

```bash
sudo npm install -g pm2
PORT=4000 pm2 start dist/IronFeed-Frontend/server/server.mjs --name ironfeed-frontend
pm2 save
pm2 startup
```

## 5. Nginx en la instancia pública

Crear `/etc/nginx/sites-available/ironfeed`:

```nginx
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://IP_PRIVADA_BACKEND:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar configuración:

```bash
sudo ln -s /etc/nginx/sites-available/ironfeed /etc/nginx/sites-enabled/ironfeed
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Validación final

Desde la EC2 pública:

```bash
curl http://IP_PRIVADA_BACKEND:8080/actuator/health
curl http://localhost/api/posts/page?page=1
```

Desde tu navegador:

```text
http://IP_PUBLICA_FRONTEND
```

## Notas

- Para una demo académica se usa HTTP. Si tienes dominio y certificados, agrega HTTPS en Nginx.
- Si la IP privada del backend cambia, actualiza `proxy_pass` en Nginx.
- `docker-compose.aws.yml` no publica PostgreSQL ni los microservicios en el host; publica solo el API Gateway.
