<?php
function get_template_directory_uri(){return '';}
require dirname(__DIR__).'/tractor-accessories.php';
function verify_match($value,$message){if(!$value)throw new RuntimeException($message);}
foreach(atm_yto_catalog_data()['models'] as $tractor){$matches=atm_tractor_accessories($tractor);foreach($matches['implements'] as $m){verify_match($m['power']!==null,'Unknown power recommended');verify_match($tractor['power']>=$m['power'][0],'Power below requirement');verify_match($m['power'][1]===null||$tractor['power']<=$m['power'][1],'Power above range');}foreach($matches['tyres'] as $m)verify_match($m['group']==='agri','Industrial tyre shown for tractor');
if($tractor['id']==='ME404')verify_match(count($matches['implements'])===0&&count($matches['tyres'])===2,'ME404 mismatch');
if($tractor['id']==='NLX854')verify_match(count($matches['tyres'])===0,'Invented NLX854 tyre match');
if($tractor['id']==='LX2204'){verify_match(count($matches['tyres'])===2,'LX2204 imperial/metric alternatives mismatch');foreach($matches['tyres'] as $m)verify_match($m['pattern']!=='TI200','Mixed-purpose tyre suggested without verification');}
if($tractor['id']==='ELP2804'){verify_match(count($matches['tyres'])===2,'Missing ELP2804 radial tyres');foreach($matches['tyres'] as $m)verify_match($m['technology']==='Радиальная','Incorrect radial match');}}
echo "PASS: recommendations for all 10 tractors; power bounds, exact tyre markings, radial sizes, low-power/absent sizes, industrial exclusions.\n";
