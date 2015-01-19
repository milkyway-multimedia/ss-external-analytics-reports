<?php namespace Milkyway\SS\ExternalAnalytics\Reports\Controllers;
/**
 * Milkyway Multimedia
 * SaveAccessToken.php
 *
 * @package milkywaymultimedia.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

use Milkyway\SS\Director;

class SaveAccessToken extends \Controller {
    public function index(\SS_HTTPRequest $request)
    {
        if ($this->Response)
            $this->Response->setStatusCode(200);

        $vars = [];

        if (singleton('Milkyway_SS_ExternalAnalytics_Reports_GoogleAnalytics')->canView()) {
            if($request->postVar('access_token')) {
                file_put_contents($this->tokenLocation(), $request->postVar('access_token'));
            }

            $vars['access_token'] = $this->token();
        }

        return $request && $request->isAjax() ? json_encode($vars) : $vars;
    }

    public function Link() {
        return Director::absoluteURL('/' . (string)array_search(trim(__CLASS__, '\\'), \Config::inst()->forClass('Director')->rules));
    }

    public function token() {
        if(file_exists($this->tokenLocation()))
            return file_get_contents($this->tokenLocation());

        return '';
    }

    private function tokenLocation() {
        return TEMP_FOLDER . DIRECTORY_SEPARATOR . '.' . str_replace('\\', '_', __CLASS__) . '_token';
    }
} 