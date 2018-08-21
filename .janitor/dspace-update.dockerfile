FROM janitortechnology/dspace

# Upgrade all packages.
RUN sudo apt-get update -q && sudo apt-get upgrade -qy

# Update DSpace's source code and its dependencies.
RUN cd /home/user/dspace \
  && git fetch origin \
  && git reset --hard origin/master \
  && yarn run clean \
  && yarn install \
  && yarn prestart
  