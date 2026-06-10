# Despliegue AWS Academy en dos instancias

Esta guía prepara un despliegue simple para las restricciones habituales de AWS Academy: dos instancias EC2, sin infraestructura adicional obligatoria y sin Kafka ni `feed-ms`.

## Topología objetivo

| Instancia | Subred sugerida | Componentes | Puertos entrantes recomendados |
|---|---|---|---|
| Pública | Pública | Nginx y Angular SSR | `80` desde internet, `22` solo desde tu IP |
| Privada | Privada | API Gateway, microservicios y PostgreSQL en Docker Compose | `8080` solo desde el security group de la instancia pública, `22` solo desde bastion o tu método permitido por Academy |

El navegador llama a la instancia pública. Nginx sirve el frontend SSR y reenvía `/api/**` al API Gateway de la instancia privada por su IP privada.

## Archivos incluidos

- `docker-compose.aws-public.yml`: levanta Angular SSR y Nginx en la instancia pública.
- `deploy/public/nginx/default.conf.template`: configura Nginx para servir el frontend y reenviar `/api/**` al API Gateway privado.
- `docker-compose.aws-backend.yml`: levanta PostgreSQL, API Gateway y los microservicios actuales en la instancia privada.
- `application-aws.yaml` en cada microservicio con base de datos: evita `create-drop` y desactiva seed SQL para no reiniciar datos en cada arranque.

## Variables de entorno

En la instancia privada, crea `.env` en la raíz del repositorio:

```bash
JWT_SECRET=coloca-un-secreto-real-de-al-menos-32-caracteres
POSTGRES_SUPERUSER=postgres
POSTGRES_SUPERUSER_PASSWORD=coloca-un-password-real
API_GATEWAY_BIND_ADDRESS=0.0.0.0
```

En la instancia pública, crea `.env` en la raíz del repositorio apuntando a la IP privada de la instancia backend:

```bash
API_GATEWAY_UPSTREAM=http://IP_PRIVADA_BACKEND:8080
```

> No subas valores reales de `.env` al repositorio. En AWS Academy conviene mantenerlos como archivos locales de cada EC2.

## Pasos en la instancia privada

1. Instala Docker y el plugin de Compose si la AMI no los trae.
2. Copia el repositorio en la instancia privada.
3. Crea el `.env` privado con `JWT_SECRET`, `POSTGRES_SUPERUSER_PASSWORD` y `API_GATEWAY_BIND_ADDRESS`.
4. Levanta el backend:

```bash
docker compose -f docker-compose.aws-backend.yml up -d --build
```

5. Verifica desde la instancia pública que el gateway privado responda:

```bash
curl http://IP_PRIVADA_BACKEND:8080/actuator/health
```

## Pasos en la instancia pública

1. Instala Docker y el plugin de Compose si la AMI no los trae.
2. Copia el repositorio en la instancia pública.
3. Crea el `.env` público con `API_GATEWAY_UPSTREAM=http://IP_PRIVADA_BACKEND:8080`.
4. Levanta el frontend y Nginx:

```bash
docker compose -f docker-compose.aws-public.yml up -d --build
```

5. Abre `http://IP_PUBLICA_FRONTEND/` en el navegador.

## Notas para AWS Academy

- Si no tienes NAT Gateway, construye las imágenes en una instancia con salida a internet y luego copia el repositorio/imágenes a la instancia privada, o permite salida temporal para descargar imágenes base y dependencias.
- Mantén PostgreSQL dentro de la instancia privada si RDS no está disponible en tu laboratorio.
- No abras PostgreSQL a internet. Los microservicios acceden a PostgreSQL por la red interna de Docker.
- Restringe el puerto `8080` de la instancia privada para que solo acepte tráfico desde el security group de la instancia pública.
- El endpoint público debe ser el Nginx de la instancia pública; el frontend no debe llamar directamente a `localhost:8080` en producción.
