<?php if(!defined('KIRBY')) exit ?>

# gallery blueprint

title: Gallery Page
pages: false
files: true
fields:
  title: 
    label: Title
    type:  text
  subtitle:
    label: Subtitle
    type:  text
  short:
    label: Short Title
    type:  text
  theme:
    type: select
    options:
      default: Default
      purple: Purple
      green: Green
      red: Red
      yellow: Yellow
    default: default

  date:
    label: Date
    type:  date
  status:
    label: Status
    type: select
    options:
      Draft: Draft
      Published: Published
      Archive: Archive
    default: Draft
  text: 
    label: Text
    type:  textarea
    size:  large
    buttons: 
      - h1
      - h2
      - h3
      - bold
      - italic
      - email
      - link