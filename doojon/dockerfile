FROM perl:5.32

RUN cpanm Carton \
    && mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY cpanfile* /usr/src/app/
RUN carton install

COPY . /usr/src/app
