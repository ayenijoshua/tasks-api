FROM node:18.20.2-slim
WORKDIR /

# Copy all the files from your file system to the container file system
COPY package*.json ./

# Install all dependencies
RUN npm install

#RUN npm run dev

# Copy other files as well
COPY . ./

# Expose the port
EXPOSE 3000

# Command to execute when the image is instantiated
CMD ["npm","start"]