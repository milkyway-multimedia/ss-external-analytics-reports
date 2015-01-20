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
            'container' => 'ss-ga-report--chart--' . $this->id,
        ], $chart);
    }

    public function getTitle() {
        return _t('ExternalAnalytics.Reports.Chart.' . $this->id, ucfirst($this->title));
    }

    public function getID() {
        return $this->id;
    }

    public function getType() {
        return isset($this->chart['type']) ? $this->chart['type'] : '';
    }

    public function json() {
        return [
            'query' => $this->query,
            'chart' => $this->chart,
        ];
    }
} 