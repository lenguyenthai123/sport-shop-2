# Sử dụng một image của Node.js với phiên bản cụ thể là LTS
FROM node:lts

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép tất cả các tệp package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies của ứng dụng
RUN npm install

# Sao chép tất cả các tệp từ thư mục hiện tại vào thư mục làm việc trong container
COPY . .

# Mở cổng 3000 để ứng dụng có thể lắng nghe truy cập từ bên ngoài container
EXPOSE 8080

# Chạy lệnh để khởi động ứng dụng khi container được triển khai
CMD ["npm", "start"]
