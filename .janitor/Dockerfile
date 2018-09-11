FROM janitortechnology/ubuntu-dev

# Add the project 
ADD ../ .

WORKDIR /home/user/dspace-angular/

# Add server configuration
COPY --chown=user:user ./home/user/dspace
COPY environment.prod.js /home/user/dspace-angular/config/

# Install dependencies
RUN yarn run global \
  && yarn install \
  && yarn prestart

# Add Janitor configurations
COPY janitor.json /home/user/
RUN sudo chown user:user /home/user/janitor.json

# Configure the IDEs to use Janitor's source directory as workspace.
ENV WORKSPACE /home/user/dspace-angular/

# For DSpace Angular
EXPOSE 3000
