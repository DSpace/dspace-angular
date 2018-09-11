FROM janitortechnology/ubuntu-dev

# Fetch the source code
RUN git clone https://github.com/dspace/dspace-angular /home/user/dspace-angular/

WORKDIR /home/user/dspace-angular/

# Add server configuration
COPY --chown=user:user environment.prod.js /home/user/dspace-angular/config/

# Install dependencies
RUN yarn run global \
  && yarn install \
  && yarn prestart

# Add Janitor configurations
COPY --chown=user:user janitor.json /home/user/ 

# Configure the IDEs to use Janitor's source directory as workspace.
ENV WORKSPACE /home/user/dspace-angular/

# For DSpace Angular
EXPOSE 3000
