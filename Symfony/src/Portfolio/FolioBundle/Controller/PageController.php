<?php
// src/Portfolio/FolioBundle/Controller/PageController.php

namespace Portfolio\FolioBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function indexAction()
    {
        return $this->render('PortfolioFolioBundle:Page:index.html.twig');
    }
}