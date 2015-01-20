<?php
/**
 * Milkyway Multimedia
 * Chart.php
 *
 * @package milkywaymultimedia.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

namespace Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Components;

use ViewableData;

class Chart extends ViewableData {
    protected $title;

    protected $query = [];

    protected $chart = [
        'type' => 'TABLE',
        'options' => [
            'width' => '100%',
        ],
    ];

    protected $id;

    public function __construct($id, array $query, $chart = [], $title = '') {
        $this->id = $id;
        $this->query = array_merge($this->query, $query);

        if($title) {
            $this->title = $title;
        }
        else {
            $this->title = \FormField::name_to_label($this->id);
        }

        $this->chart = array_merge($this->chart, [
            'container' => '#ss-ga-report--chart--' . $this->id,
        ], $chart);
    }

    public function i18n_title() {
        return _t('ExternalAnalytics.Reports.Chart.' . $this->id, $this->title);
    }

    public function json() {
        return [
            'query' => $this->query,
            'chart' => $this->chart,
        ];
    }

    public function forTemplate() {
        $vars = [
            'Title' => $this->i18n_title(),
            'ID' => $this->id,
        ];

        return str_replace(array_keys($vars), $vars,'
        <div class="ss-ga-report--chart processing">
            <h3>$Title</h3>
            <div id="ss-ga-report--chart--$ID"></div>
        </div>');
    }
} 