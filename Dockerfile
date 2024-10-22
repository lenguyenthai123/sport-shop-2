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

# Mở cổng 8080 để ứng dụng có thể lắng nghe truy cập từ bên ngoài container
EXPOSE 8080

# Định nghĩa các biến môi trường
ENV PORT=8080
ENV HOST_NAME=18.139.208.34
ENV NODE_ENV=production
ENV DB_HOST=localhost
ENV DB_PORT=3307
ENV DB_PASSWORD=123456
ENV DB_USER=root
ENV DB_NAME=hoidanit
ENV MONGO_URI=mongodb+srv://lenguyenthai123:lenguyenthai123@cluster0.ctwm4lc.mongodb.net/03-TASK-MANAGER?retryWrites=true&w=majority
ENV MONGO_URI1=mongodb://localhost:8080
ENV PRIVATE_KEY=MUHAHAHAHA
ENV JWT_SECRET=MUHAHAHAHA
ENV SESSION_SECRET=AHSCJKNSKDNC
ENV MAIL_CLIENT_ID=1031803914366-8p2j6d3cfrkbknur6g370nubodhsv0ot.apps.googleusercontent.com
ENV MAIL_CLIENT_SECRET=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
ENV MAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
ENV MAIL_REFRESH_TOKEN=1//04gRYmK6oRkd1CgYIARAAGAQSNwF-L9Ircw3t-QbEv3O495-DpmbNGo3Z5RXlBNw3n8WTiMokjOH413-0d8A2R9whbZUDpCfL5bI
ENV CLOUDINARY_URL=cloudinary://958512834993732:WwI76oZEzZo3P_LGr4epfHUkYRo@dfq7tgvs1
ENV WEBSITE_URL=http://localhost:8080
ENV GOOGLE_CLIENT_ID=727263293189-in2il0tqlpef3h0a1r920gpitt1bo63j.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV GOOGLE_CLIENT_REDIRECT_URL=http://www.cungthieulamsport.xyz/auth/google/callback
ENV FACEBOOK_APP_ID=909019557403536
ENV FACEBOOK_APP_SECRET=e66354eedd802e9865bdedf706c5326e
ENV FACEBOOK_APP_REDIRECT_URL=http://54.255.225.149:80/auth/facebook/callback

# Chạy lệnh để khởi động ứng dụng khi container được triển khai
CMD ["npm", "start"]
