<?php
/**
 * User: xiaohui
 * Date: 2018/8/20
 * Time: 15:17
 */

namespace Admin\V3_7_1;


class TestController extends \BaseController
{

    private $com;

    /**
     * need to install openoffice and run in the background
     * soffice -headless-accept="socket,host=127.0.0.1,port=8100;urp;" -nofirststartwizard
     */
    public function __construct()
    {
        try {
            $this->com = new \COM('com.sun.star.ServiceManager');
        } catch (\Exception $e) {
            die('Please be sure that OpenOffice.org is installed.');
        }
    }

    /**
     * Execute PDF file(absolute path) conversion
     * @param $source [source file]
     * @param $export [export file]
     */
    public function wordTOpdf($source, $export)
    {
        $source = 'file:///' . str_replace('\\', '/', $source);
        $export = 'file:///' . str_replace('\\', '/', $export);
        $this->convertProcess($source, $export);
    }

    /**
     * Get the PDF pages
     * @param $pdf_path [absolute path]
     * @return int
     */
    public function getPages($pdf_path)
    {
        if (!file_exists($pdf_path)) return 0;
        if (!is_readable($pdf_path)) return 0;
        if ($fp = fopen($pdf_path, 'r')) {
            $page = 0;
            while (!feof($fp)) {
                $line = fgets($fp, 255);
                if (preg_match('/\/Count [0-9]+/', $line, $matches)) {
                    preg_match('/[0-9]+/', $matches[0], $matches2);
                    $page = ($page < $matches2[0]) ? $matches2[0] : $page;
                }
            }
            fclose($fp);
            return $page;
        }
        return 0;
    }

    private function setProperty($name, $value)
    {
        $struct = $this->com->Bridge_GetStruct('com.sun.star.beans.PropertyValue');
        $struct->Name = $name;
        $struct->Value = $value;
        return $struct;
    }

    private function convertProcess($source, $export)
    {
        $desktop_args = array($this->setProperty('Hidden', true));
        $desktop = $this->com->createInstance('com.sun.star.frame.Desktop');
        $export_args = array($this->setProperty('FilterName', 'writer_pdf_Export'));
        $program = $desktop->loadComponentFromURL($source, '_blank', 0, $desktop_args);
        $program->storeToURL($export, $export_args);
        $program->close(true);
    }

    public function anyTry()
    {
        $converter = new TestController();
        $source = dirname(__FILE__) . "/aa.docx";
        $export = dirname(__FILE__) . "/bb.xml";
        $converter->wordTOpdf($source, $export);
//        }
    }

    protected function word2pdf($doc_url, $output_url)
    {
        $osm = new \COM("com.sun.star.ServiceManager") or die ("Please be sure that OpenOffice.org is installed.n");
        $args = array(self::MakePropertyValue("Hidden", true, $osm));
        $oDesktop = $osm->createInstance("com.sun.star.frame.Desktop");
        $oWriterDoc = $oDesktop->loadComponentFromURL($doc_url, "_blank", 0, $args);
        $export_args = array(self::MakePropertyValue("FilterName", "writer_pdf_Export", $osm));
        $oWriterDoc->storeToURL($output_url, $export_args);
        $oWriterDoc->close(true);
    }

    protected function MakePropertyValue($name, $value, $osm)
    {
        $oStruct = $osm->Bridge_GetStruct("com.sun.star.beans.PropertyValue");
        $oStruct->Name = $name;
        $oStruct->Value = $value;
        return $oStruct;
    }

    public function anyTest()
    {
        $doc_file = dirname(__FILE__) . "/aa.docx"; //源文件，DOC或者WPS都可以
        $output_file = dirname(__FILE__) . "/cc.csv"; //欲转PDF的文件名
        $output_file = str_replace("\\", "/", $output_file);
        $doc_file = "file:///" . $doc_file;
        $output_file = "file:///" . $output_file;
        $res = $this->word2pdf($doc_file, $output_file);
    }
}