<?php namespace Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Controllers;
/**
 * Milkyway Multimedia
 * SaveAccessToken.php
 *
 * @package milkywaymultimedia.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

use Milkyway\SS\Director;

class SaveAccessToken extends \Controller {
    protected $reportClass = 'Milkyway_SS_ExternalAnalytics_Reports_GoogleAnalytics_Report';

    public function index(\SS_HTTPRequest $request)
    {
        if ($this->Response)
            $this->Response->setStatusCode(200);

        $vars = [];

        if (singleton($this->reportClass)->canView()) {
            if($request->postVars()) {
                file_put_contents($this->tokenLocation(), json_encode($request->postVars()));
            }

            $vars = $this->token();
            if(!$vars)
                $vars = [];
        }

        return $request && $request->isAjax() ? json_encode($vars) : $vars;
    }

    public function Link() {
        return Director::absoluteURL('/' . (string)array_search(trim(__CLASS__, '\\'), \Config::inst()->forClass('Director')->rules));
    }

    public function token() {
        if(file_exists($this->tokenLocation())) {
            $token = json_decode(file_get_contents($this->tokenLocation(), true));
            return (isset($token->expires_at) && time() > $token->expires_at) ? null : $token;
        }

        return null;
    }

    private function tokenLocation() {
        return TEMP_FOLDER . DIRECTORY_SEPARATOR . '.' . str_replace('\\', '_', __CLASS__) . '_token';
    }
}