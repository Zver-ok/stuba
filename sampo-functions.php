<?php
require_once __DIR__.'/equipment-navigation.php';
function atm_sampo_data(): array {
    static $data;
    return $data??=json_decode(file_get_contents(__DIR__.'/sampo-data.json'),true,512,JSON_THROW_ON_ERROR);
}
function atm_sampo_model(): ?array {
    $id=$_GET['model']??'C12';
    if(!is_string($id))return null;
    foreach(atm_sampo_data()['models'] as $model)if($model['id']===strtoupper($id))return $model;
    return null;
}
function atm_sampo_whatsapp(?array $model=null,string $purpose='цена, наличие и комплектация'): string {
    return 'https://wa.me/77775550665?text='.rawurlencode('Здравствуйте! Интересует '.($model['name']??'комбайн Sampo-Rosenlew').'. Подскажите: '.$purpose.'.');
}
function atm_sampo_card(array $model,bool $compare=false): void {
    $url=atm_yto_url('/sampo-product/?model='.$model['id']);
    ?>
    <article class="product catalog-product sampo-card" data-id="<?= atm_yto_escape($model['id']) ?>" data-name="<?= atm_yto_escape($model['name']) ?>" data-kind="<?= $model['kind'] ?>" data-power="<?= $model['power']??0 ?>">
        <a class="product-photo" href="<?= atm_yto_escape($url) ?>"><img src="<?= atm_yto_escape(atm_yto_asset($model['image'])) ?>" alt="<?= atm_yto_escape($model['name']) ?>" loading="lazy"></a>
        <div class="product-body"><span class="sampo-card-type"><?= ['production'=>'Зерноуборочный комбайн','research'=>'Селекционный комбайн','request'=>'Комплектация по запросу'][$model['kind']] ?></span><h3><a href="<?= atm_yto_escape($url) ?>"><?= atm_yto_escape($model['name']) ?></a></h3><p class="product-caption"><?= atm_yto_escape($model['lead']) ?></p><div class="compact-specs"><span><b><?= $model['power']?$model['power'].' л.с.':'По запросу' ?></b>Мощность</span><span><b><?= atm_yto_escape($model['tank']) ?></b>Бункер</span></div><div class="product-actions"><a class="button small" href="<?= atm_yto_escape($url) ?>">Подробнее →</a><a class="button outline small" href="<?= atm_yto_escape(atm_sampo_whatsapp($model)) ?>" target="_blank" rel="noopener">Получить КП</a></div><?php if($compare && $model['power']): ?><label class="compare-choice"><input type="checkbox" data-sampo-compare="<?= $model['id'] ?>"> Сравнить модель</label><?php endif ?></div>
    </article>
    <?php
}
function atm_sampo_finance(): void { ?>
<section class="container sampo-finance section" id="sampo-finance"><div><span class="section-kicker">КАЗАГРОФИНАНС · COMIA C12</span><h2>Уборочная техника.<br><em>Льготный лизинг.</em></h2><p>Обсудите приобретение Sampo Comia C12 через «КазАгроФинанс». Поможем уточнить условия программы, наличие комбайна и подготовку документов.</p><a class="button" href="<?= atm_yto_escape(atm_sampo_whatsapp(atm_sampo_data()['models'][0],'льготный лизинг через КазАгроФинанс, актуальность программы и наличие')) ?>" target="_blank" rel="noopener">Узнать условия для C12 →</a></div><div><div class="sampo-finance-figures"><span><b>от 10%</b>Первоначальный взнос</span><span><b>от 5%</b>Годовая ставка</span><span><b>до 7 лет</b>Срок лизинга</span></div><p class="source-caption">Предложение для Comia C12. Доступность программы, требования к заявителю и итоговые условия подтверждаются «КазАгроФинанс». На остальные модели автоматически не распространяются.</p></div></section>
<?php }
function atm_sampo_form(?array $model=null): void { ?>
<section class="container service-request sampo-request" id="sampo-request"><div><span class="section-kicker">НА СВЯЗИ С ВАМИ</span><h2><?= $model?'Узнайте больше о '.atm_yto_escape($model['id']):'Подберём комбайн под вашу уборку' ?></h2><p>Расскажите о культурах, площади, сроках уборки и нужной жатке. Уточним комплектацию, наличие, цену и варианты финансирования.</p><a class="office-phone" href="tel:+77775550665">+7 777 555 06 65</a><p>Астана, ул. Александра Пушкина, 32Б</p><a class="text-link" href="<?= atm_yto_escape(atm_yto_url('/branches/')) ?>">Все филиалы и маршруты →</a></div><form class="quick-request" data-purpose="Интересует комбайн Sampo-Rosenlew"><label>Ваше имя<input name="name" autocomplete="name" required maxlength="100"></label><label>Телефон<input name="phone" type="tel" autocomplete="tel" required maxlength="40" placeholder="+7 (___) ___-__-__"></label><label>Город / регион<input name="city" autocomplete="address-level2" maxlength="120"></label><label>Модель<select name="model"><?php foreach(atm_sampo_data()['models'] as $item): ?><option value="<?= atm_yto_escape($item['name']) ?>" <?= $model && $model['id']===$item['id']?'selected':'' ?>><?= atm_yto_escape($item['name']) ?></option><?php endforeach ?></select></label><label>Ваша задача<textarea name="task" rows="3" maxlength="1500" placeholder="Культуры, площадь, интересующая комплектация"></textarea></label><button class="button" type="submit">Подготовить обращение в WhatsApp →</button><small>Нажимая кнопку, вы соглашаетесь на обработку данных для ответа на обращение. <a href="<?= atm_yto_escape(atm_yto_url('/privacy/')) ?>">Политика конфиденциальности</a>. Сообщение отправляете самостоятельно в WhatsApp.</small><p class="inquiry-status" role="status"></p><noscript>Для подготовки сообщения включите JavaScript или позвоните нам по номеру выше.</noscript></form></section>
<?php }
function atm_sampo_mobile_contact(?array $model=null): void { ?>
<aside class="sampo-mobile-contact" aria-label="Связаться по комбайнам Sampo"><a href="tel:+77775550665">Позвонить</a><a href="<?= atm_yto_escape(atm_sampo_whatsapp($model)) ?>" target="_blank" rel="noopener">WhatsApp →</a></aside>
<?php }
