FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update \
    && apt upgrade \
    && apt install -y --no-install-recommends postgresql-client vim \
    && rm -rf /var/lib/apt/lists/* \

RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ['python', 'manage.py', 'runserver', '0.0.0.0:8000']