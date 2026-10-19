<?php
require_once __DIR__.'/farmet-functions.php';require_once __DIR__.'/tyres-functions.php';
function atm_normalize_tyre_size(string $value): string {
    $value=strtoupper(str_replace(',','.',$value));
    return preg_replace_callback('/\d+\.\d+/',fn($m)=>(string)(float)$m[0],$value);
}
function atm_tractor_accessories(array $tractor): array {
    $implements=array_values(array_filter(atm_farmet_data()['models'],fn($m)=>$m['power']!==null&&$tractor['power']>=$m['power'][0]&&($m['power'][1]===null||$tractor['power']<=$m['power'][1])));
    $sizes=[];foreach($tractor['specs'] as $rows)foreach($rows as [$label,$value])if(in_array($label,['Передние шины','Задние шины'],true)){preg_match_all('/\d+(?:[.,]\d+)?(?:\/\d+)?(?:R|-)\d+/i',$value,$matches);foreach($matches[0] as $size)$sizes[atm_normalize_tyre_size($size)]=$label==='Передние шины'?'Передняя ось':'Задняя ось';}
    $tyres=[];foreach(atm_tyres_data()['models'] as $tyre){$size=atm_normalize_tyre_size($tyre['size']);if($tyre['group']==='agri'&&isset($sizes[$size])){$tyre['matchedAxle']=$sizes[$size];$tyres[]=$tyre;}}
    return ['implements'=>$implements,'tyres'=>$tyres];
}
function atm_render_tractor_accessories(array $tractor): void {
    $matches=atm_tractor_accessories($tractor);
    foreach(['implements','tyres'] as $kind){$items=$matches[$kind];$isTyre=$kind==='tyres'; ?>
<section class="container accessory-carousel product-section" data-accessory-carousel data-kind="<?= $kind ?>"><div class="section-heading"><div><span class="section-kicker">К <?= atm_yto_escape($tractor['name']) ?></span><h2><?= $isTyre?'Шины с подходящей маркировкой размера':'Почвообрабатывающая техника по мощности' ?></h2></div><a class="text-link" href="<?= $isTyre?'/tyres-catalog/':'/farmet-catalog/' ?>">Весь каталог →</a></div><p class="accessory-note"><?= $isTyre?'Размер совпадает с указанным исполнением трактора. Нагрузку, скорость, диск, камеру и сочетание шин на полном приводе нужно проверить перед установкой.':'Отбор по диапазону мощности трактора. Категорию сцепки, грузоподъёмность навески, гидравлику и условия работы подтвердим при подборе.' ?></p>
<?php if($items): ?><div class="accessory-controls"><button type="button" data-slide="prev" aria-label="Предыдущие товары">←</button><button type="button" data-slide="next" aria-label="Следующие товары">→</button></div><div class="accessory-track" tabindex="0" aria-label="<?= $isTyre?'Шины':'Орудия Farmet' ?> для <?= atm_yto_escape($tractor['name']) ?>"><?php foreach($items as $item): ?><div class="accessory-item" data-match-id="<?= $item['id'] ?>"><?php if($isTyre): ?><p class="accessory-match"><?= $item['matchedAxle'] ?> · <?= atm_yto_escape($item['size']) ?></p><?php atm_tyres_card($item,false);else: ?><p class="accessory-match"><?= atm_yto_escape(atm_farmet_power($item)) ?> · мощность трактора</p><?php atm_farmet_card($item,false,true);endif ?></div><?php endforeach ?></div><?php else: ?><div class="accessory-empty"><p><?= $isTyre?'Шин с такой маркировкой размера сейчас нет в этом разделе. Поможем проверить возможные варианты.':'Для этой мощности в разделе пока нет орудий с подтверждённым диапазоном. Подберём решение индивидуально.' ?></p><button class="button outline" type="button" data-lead-open data-lead-model="<?= atm_yto_escape($tractor['name']) ?>" data-lead-topic="<?= $isTyre?'Подбор шин':'Подбор почвообрабатывающей техники' ?>">Получить консультацию →</button></div><?php endif ?></section>
<?php }
}
