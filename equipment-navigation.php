<?php
require_once __DIR__.'/site-data.php';
/** Shared category links; icon files can be replaced without editing markup. */
function atm_equipment_navigation(string $active): void {
    $categories=[
        ['tractors','Тракторы','/','tractor.svg'],
        ['combines','Зерноуборочные комбайны','/sampo/','combine.svg'],
        ['tillage','Почвообрабатывающая техника','/farmet/','tillage.svg'],
        ['wheels','Колеса','/tyres/','wheel.svg'],
    ];
    echo '<nav class="equipment-categories" aria-label="Категории техники"><div class="container equipment-category-grid">';
    foreach($categories as [$id,$label,$path,$icon]) {
        $current=$id===$active;
        echo '<a class="equipment-category'.($current?' is-active':'').'"'.($current?' aria-current="page"':'').' href="'.atm_yto_escape(atm_yto_url($path)).'"><span class="equipment-category-icon" aria-hidden="true" style="--category-icon:url(\''.atm_yto_escape(atm_yto_asset('assets/images/categories/'.$icon)).'\')"></span><span>'.atm_yto_escape($label).'</span></a>';
    }
    echo '</div></nav>';
}
