FROM node:18-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# Build the app
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN VITE_AWS_REGION=ap-south-1 \
	VITE_USER_POOLID=ap-south-1_xjUQEDhPl \
	VITE_USER_POOL_WEB_CLIENTID=5mulibsod28nbfc9kj8k8db8kb \
	VITE_OAUTH_DOMAIN=login.attryb.com \
	VITE_OAUTH_REDIRECT_SIGNIN=https://accounts.attryb.com/ \
	VITE_OAUTH_REDIRECT_SIGNOUT=https://accounts.attryb.com/?product=personalization \
	VITE_SERVER_BASE_URL=https://ua.attryb.com \
	VITE_PROXY_SERVER_BASE_URL=https://pps.attryb.com \
	VITE_STATIC_PAGES_URL=https://attryb.com \
	VITE_AUTH_URL=https://accounts.attryb.com \
	VITE_PRODUCT_PAGE_BASE_URL=https://contentapi.attryb.com/product \
	VITE_CLIENT_BASE_URL=https://personalization.attryb.com \
	VITE_AUTH_ACCESS_TOKEN=482B4D6251655468566D597133743677397A24432646294A404E635266556A58 \
	VITE_CONTENT_STUDIO_URL=https://contentstudio.attryb.com \
	VITE_CONTENT_STUDIO_API_URL=https://cs.attryb.com \
	VITE_ATTRYB_BASE_URL=https://attryb.com \
	VITE_AUTH_DOMAIN=.attryb.com \
	VITE_PAYMENT_BASE_URL=https://paymentsapi.attryb.com \
	VITE_PRODUCT_ID=942338b7-7d33-11ed-9f3b-00155d3e8ac7 \
 	VITE_VELOCITY_BASE_URL=https://velocityapi.attryb.com \
	npm run start:prod

# Bundle static assets with nginx
FROM nginx:1.23.3-alpine as production
# Copy built assets from `builder` image
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY .nginx/nginx.conf /etc/nginx/conf.d/
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
