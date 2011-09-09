<?php
/**
 * CROSS DOMAIN Proxy
 */
header("Access-Control-Allow-Origin: *");

$p = array_merge(array("callback"=>"", "path"=> "" ), $_REQUEST);

$o = file_get_contents($p["path"] );

echo $p['callback'] ? $p['callback']. '(' . $o . ')' : $o;


?>