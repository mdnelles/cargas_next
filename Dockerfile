# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Ensure the public folder is copied
COPY public ./public

COPY next.config.ts .

# Build the Next.js app
RUN npm run build

# Expose port 3010 and start the application
EXPOSE 3010
CMD ["npm", "start"]


# LOCAL
# docker rm $(docker ps -a -q) -f       (remove all exited containers)
# docker image prune -a                 (remove all unused images)
# docker container prune                 (remove all stopped containers)
# docker volume prune                    (remove all unused volumes)
# docker builder prune                   (remove all unused builders)
# docker buildx create --use            (not needed if already created)
# docker buildx build --platform linux/amd64 -t mdnelles/cargas:latest --load .
# docker images                         (to get the <IMAGE_ID>)
# docker tag <IMAGE_ID> mdnelles/cargas:latest
# docker push mdnelles/cargas:latest


# SERVER:
# sudo docker pull mdnelles/cargas:latest
# sudo docker ps -a (to get the container id)
# sudo docker stop 0d0c97c8d57f (or whatever the container id is)
# sudo docker run -d -p 3010:3010 -e PORT=3010 --restart unless-stopped mdnelles/cargas


# STOP CONTAINER:
# sudo docker ps (to get the container id)
# sudo docker stop 0d0c97c8d57f (or whatever the container id is)
    


# sudo lsof -i -P -n | grep LISTEN
# sudo docker logs 0d0c97c8d57f


# >>> clearing up the server except currently running container "blissful_booth"
#### try running the following command with sudo to stop all containers except blissful_booth:
# sudo docker ps -a --format "{{.Names}}" | grep -v "blissful_booth" | xargs -I {} sudo docker stop {}

#### Similarly, to remove all containers except blissful_booth, run:
# sudo docker ps -a --format "{{.Names}}" | grep -v "blissful_booth" | xargs -I {} sudo docker rm {}