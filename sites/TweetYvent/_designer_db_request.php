<?php
// open connection to MongoDB server
	$conn = new Mongo($MONGO_HOST);
		
	// access database
	$db = $conn->{'tweet-event'};
	
	//get the designers collection of tweets
	if (isset($designers) && $designers != "all") {
	
		$collection = $db->$designers;
		
		$skip = isset($start) ? intval($start) : 0;
		
		if (!isset($section) || $section == 'tweets') {
		
			$tweets_cursor = $collection->find()->sort(array('created_at'=>-1))->skip($skip)->limit(10);
		
			foreach ($tweets_cursor as $key=>$value) {
				
				$tweet_list[] = array("id"=>$key, "tweet"=>$value);
				
			}

		}
		
				
		//get tweets with urls and images
		
		if (!isset($section) || $section == 'photos') {
		
			$pattern = '/^http:\/\/(yfrog.|instagr.|lockerz.|twitpic.|pic.twitter.)/i';
			$url_link = 'entities.urls';
			
			$mongoRegExp = new MongoRegex($pattern);
			
			$elemMatch1 = array( $url_link => array( '$elemMatch' => array( 'url'=> $mongoRegExp )));
			$elemMatch2 = array( $url_link => array( '$elemMatch' => array( 'expanded_url'=> $mongoRegExp )));
			$orArr = array( $elemMatch1, $elemMatch2  );
			
			
			$url_cursor = $collection->find( array( '$or' => $orArr )  )->skip($skip)->limit(10);
			
			foreach($url_cursor as $key=>$value) {
				$urls_length = count($value["entities"]["urls"]);
				$img_urls = array();
				for ($i=0;$i<$urls_length;$i++) {
					if (isset($value["entities"]["urls"][$i]["url"])) {
					
						if (isset($value["entities"]["urls"][$i]["expanded_url"])) {
							$str = $value["entities"]["urls"][$i]["expanded_url"];
							if (preg_match($pattern, $str)) {
								$img_urls[] = $str;
								
							}
						} else {
							$str = $value["entities"]["urls"][$i]["url"];
							if (preg_match($pattern, $str)) {
								$img_urls[] = $str;
								
							}
						}
					}
				}
				
				$img_count = count($img_urls);
				if ($img_count > 0) {
					$url_list[] = array("id"=>$key, "tweet"=>$value, "img_urls"=>$img_urls);
				}
			}
			
		}
		
		if (!isset($section)) {
		
			//get the global words collection for trend list
			$words = $db->words;
			
			$designer_counts = 'counts.'.$designers;
			$words_cursor = $words->find(array( $designer_counts=>array( '$exists'=> true ) ))->sort(array($designer_counts=>-1))->limit(10);
				
			
			foreach ($words_cursor as $key=>$arr) {
			
				if ($arr["counts"][$designers] && $arr["counts"][$designers] > 2) {
					$trends_list[] = array("count"=>$arr["counts"][$designers], "word"=>$arr["word"]);
				}
				
			}
			
			//get colors
			$colors = $db->colors;
			
			$designer_counts = 'counts.'.$designers;
			$colors_cursor = $colors->find(array( $designer_counts=>array( '$exists'=> true ) ))->sort(array($designer_counts=>-1))->limit(10);
			foreach ($colors_cursor as $key=>$arr) {
			
				if ($arr["counts"][$designers]) {
					$colors_list[] = array("count"=>$arr["counts"][$designers], "color"=>$arr["color"]);
				}
				
			}
		}
		
	} else {
	
		//for all designers we can only get the trend info and a random selection of recent tweets
		
		$tweets_collected = 0;
		
		for ($i=0; $tweets_collected<10; $i++) {
			
			$random_num = array_rand($designer_ids);
			$random_designer = $designer_ids[$random_num];
			$collection = $db->$random_designer;
			
		
			$tweets_cursor = $collection->find()->sort(array('created_at'=>-1))->limit(1);
			
			foreach ($tweets_cursor as $key=>$value) {
				
				$tweet_list[] = array("id"=>$key, "tweet"=>$value);
				
				$tweets_collected++;
				
			}
			
			//get tweets with urls and images
			
			$pattern = '/^http:\/\/(yfrog.|instagr.|lockerz.|twitpic.|pic.twitter.)/i';
			$url_link = 'entities.urls';
			
			$mongoRegExp = new MongoRegex($pattern);
			
			$elemMatch1 = array( $url_link => array( '$elemMatch' => array( 'url'=> $mongoRegExp )));
			$elemMatch2 = array( $url_link => array( '$elemMatch' => array( 'expanded_url'=> $mongoRegExp )));
			$orArr = array( $elemMatch1, $elemMatch2  );
			
			
			$url_cursor = $collection->find( array( '$or' => $orArr )  )->limit(2);
			//$url_cursor = $collection->find( array( $url_link=>array('$size'=>1) ) )->sort(array('created_at'=>-1))->limit(20);
			
			foreach($url_cursor as $key=>$value) {
				$urls_length = count($value["entities"]["urls"]);
				$img_urls = array();
				for ($i=0;$i<$urls_length;$i++) {
					if (isset($value["entities"]["urls"][$i]["url"])) {
					
						if (isset($value["entities"]["urls"][$i]["expanded_url"])) {
							$str = $value["entities"]["urls"][$i]["expanded_url"];
							if (preg_match($pattern, $str)) {
								$img_urls[] = $str;
								
							}
						} else {
							$str = $value["entities"]["urls"][$i]["url"];
							if (preg_match($pattern, $str)) {
								$img_urls[] = $str;
								
							}
						}
					}
				}
				
				$img_count = count($img_urls);
				if ($img_count > 0) {
					$url_list[] = array("id"=>$key, "tweet"=>$value, "img_urls"=>$img_urls);
				}
			}

		}
				
		//get the words for all
		$words = $db->words;
		
		$designer_counts = 'counts.total';
		$words_cursor = $words->find(array( $designer_counts=>array( '$exists'=> true ) ))->sort(array($designer_counts=>-1))->limit(10);
			
		
		foreach ($words_cursor as $key=>$arr) {
		
			if ($arr["counts"]["total"] && $arr["counts"]["total"] > 2) {
				$trends_list[] = array("count"=>$arr["counts"]["total"], "word"=>$arr["word"]);
			}
			
		}
		
		//get colors
		$colors = $db->colors;
		
		$designer_counts = 'counts.total';
		$colors_cursor = $colors->find(array( $designer_counts=>array( '$exists'=> true ) ))->sort(array($designer_counts=>-1))->limit(10);
		foreach ($colors_cursor as $key=>$arr) {
		
			if ($arr["counts"]["total"]) {
				$colors_list[] = array("count"=>$arr["counts"]["total"], "color"=>$arr["color"]);
			}
			
		}

	}

?>
