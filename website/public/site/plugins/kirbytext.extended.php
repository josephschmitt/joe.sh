<?php 

class kirbytextExtended extends kirbytext {
  
  function __construct($text, $markdown=true) {
    
    parent::__construct($text, $markdown);
    
    /*   

    // define custom tags
    $this->addTags('mynewtag');
    
    // define custom attributes
    $this->addAttributes('mynewattribute');    
    
    */
    $this->addTags('forkme');
    $this->addAttributes('ribbon');

    $this->addTags('heading');
    $this->addAttributes('el');
    $this->addAttributes('id');
	
  	$this->addTags('figure');
	$this->addAttributes('caption', 'align', 'width', 'maxwidth');
  }  

  /*
  
  // define a function for each new tag you specify  
  
  function mynewtag($params) {
    // do something with the passed params here.
  }
  
  */

  function forkme($params) {
    $ribbons = array(
      'lightblue' => 'forkme_right_lightblue_729dd6.png',
      'purple' => 'forkme_right_purple_C272ED.png',
      'red' => 'forkme_right_red_E3422F.png',
      'green' => 'forkme_right_green_72EDAD.png',
      'yellow' => 'forkme_right_yellow_CCE36D.png',
      'white' => 'forkme_right_white_ffffff.png',
      'gray' => 'forkme_right_gray_6d6d6d.png',
      'darkblue' => 'forkme_right_darkblue_121621.png',
      'orange' => 'forkme_right_orange_ff7600.png'
    );

    // define default values for attributes
    $defaults = array(
      'forkme' => 'josephschmitt',
      'ribbon' => 'lightblue'
    );
    
    // merge the given parameters with the default values
    $options = array_merge($defaults, $params);

    $repo = $options['forkme'];
    $ribbon = $ribbons[$options['ribbon']];

    return '<a id="forkme" href="https://github.com/' . $repo . '"><img src="' . '/assets/images/gh_ribbons/' . $ribbon . '" alt="Fork me on GitHub"></a>';
  }


  function heading($params) {
	// define default values for attributes
	$defaults = array(
	  'heading' => '',
	  'el' => 'h2',
	  'id' => ''
	);
    	
	// merge the given parameters with the default values
	$options = array_merge($defaults, $params);
    	
	$el = $options['el'];
	$id = $options['id'];
	$heading = $options['heading'];
    	
	return '<' .$el.' id="'. $id .'"><a href="#'. $id .'">'. $heading .'</a></'. $el .'>';
  }
  
  function figure($params) {
  	// define default values for attributes
  	$defaults = array(
  	  'caption' => '',
  	  'align' => 'center',
  	  'width' => '',
	  'maxwidth' => ''
  	);
    	
  	// merge the given parameters with the default values
  	$options = array_merge($defaults, $params);
 
	global $site;
 
	$page = ($this->obj) ? $this->obj : $site->pages()->active();
	$width = !empty($options['width']) ? 'width:'.$options['width'].';' : '';
	$maxwidth = !empty($options['maxwidth']) ? 'max-width:'.$options['maxwidth'].';' : '';
	
	//Look for image locally. If not found, assume the image is a direct URL
	$image = $page->images()->find($options['figure']);
	$image_url = $image ? $image->url() : $options['figure'];
	
	$style = $width || $maxwidth ? 'style="' . $width . $maxwidth . '"' : '';
 
 	// try to fetch the caption from the alt text if not specified
 	// if(empty($options['caption'])) $options['caption'] = @$options['alt'];
 
 	// try to fetch the alt text from the caption if not specified
 	if(empty($options['alt'])) $options['alt'] = @$options['caption'];
	 
 	// html output
 	if(!empty($options['align'])) {
	 		$html = '<figure style="text-align:' . $options['align'] . ';">';
 	} else {
	 		$html = '<figure>';
 	}
 
	$html .= '<img src="' . $image_url . '" alt="' . $options['alt'] . '" '. $style .' />';
 
  	// only add a caption if one is available
  	if(!empty($options['caption'])) {
  		$html .= '<figcaption>' . $options['caption'] . '</figcaption>';
  	}
 
	  $html .= '</figure>';
 
	  return $html;
 
  	}
}

?>