<?php
/** Shared, read-only data and rendering helpers for the YTO WordPress templates. */
function atm_yto_escape($value): string { return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function atm_yto_catalog_data(): array {
    static $data=null;
    if ($data!==null) return $data;
    $source=file_get_contents(__DIR__.'/catalog-data.js');
    if (!preg_match('/window\.YTO_CATALOG\s*=\s*(\{.*\})\s*;\s*$/s',$source,$matches)) throw new RuntimeException('Invalid YTO catalogue data');
    return $data=json_decode($matches[1],true,512,JSON_THROW_ON_ERROR);
}
function atm_yto_selected_model(): ?array {
    $requested=$_GET['model']??'NMF804-8';
    if (!is_string($requested)) return null;
    foreach (atm_yto_catalog_data()['models'] as $model) if ($model['id']===strtoupper($requested)) return $model;
    return null;
}
function atm_yto_url(string $path): string { return function_exists('home_url')?home_url($path):$path; }
function atm_yto_asset(string $path): string { return rtrim(get_template_directory_uri(),'/').'/'.ltrim($path,'/'); }
function atm_yto_card(array $model,bool $compare=false): string {
    $escape='atm_yto_escape';
    $url=atm_yto_url('/product/?model='.rawurlencode($model['id']));
    $whatsapp='https://wa.me/77775550665?text='.rawurlencode('Здравствуйте! Интересует '.$model['name'].'. Подскажите цену, наличие и комплектацию.');
    return '<article class="product catalog-product" data-name="'.$escape($model['name']).'" data-power="'.$model['power'].'" data-kind="'.$model['group'].'" data-id="'.$escape($model['id']).'" data-ac="'.($model['airConditioning']?'true':'false').'"><a class="product-photo" href="'.$escape($url).'"><span class="stock-badge">'.$model['power'].' л.с. · 4×4</span><img src="'.$escape(atm_yto_asset($model['image'])).'" alt="'.$escape($model['name']).'" loading="lazy"></a><div class="product-body"><a href="'.$escape($url).'"><h3>'.$escape($model['name']).'</h3></a><p class="product-caption">'.$escape($model['lead']).'</p><div class="compact-specs"><span><b>'.$escape($model['gears']).'</b>Передачи</span><span><b>'.$model['hydraulicPairs'].' пары</b>Гидровыходы</span><span><b>'.$model['mass'].'</b>Масса, кг</span></div><div class="product-actions"><a class="button small" href="'.$escape($url).'">Подробнее →</a><button type="button" class="button outline small" data-lead-open data-lead-topic="Получить коммерческое предложение">Получить КП</button></div>'.($compare?'<label class="compare-choice"><input type="checkbox" data-compare="'.$escape($model['id']).'"> Сравнить модель</label>':'').'</div></article>';
}
function atm_yto_specs(array $model): string {
    $html='';
    foreach ($model['specs'] as $title=>$rows) {
        $html.='<details'.($html===''?' open':'').'><summary>'.atm_yto_escape($title).'</summary><dl class="specification-table">';
        foreach ($rows as [$key,$value]) $html.='<div><dt>'.atm_yto_escape($key).'</dt><dd>'.atm_yto_escape($value).'</dd></div>';
        $html.='</dl></details>';
    }
    return $html;
}

require_once __DIR__.'/lead-form.php';
