<?php if(!defined('KIRBY')) exit ?>

# default blueprint

title: Page
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
  link:
  	label: External Post Link
  	type:  text
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