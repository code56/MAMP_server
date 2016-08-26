    <!-- header starts-->
    <div id="header-wrap">
      <div id="header" class="container_16">
        <div id="header-main">
          <h1 id="logo-text"><a href="<?php print $front_page; ?>"><?php print $site_name; ?></a></h1>
          <p id="slogan"><?php print $site_slogan; ?></p>
        </div><!-- navigation -->
        <div id="nav">
          <?php print theme('links__system_main_menu', array(
            'links' => $main_menu,
            'attributes' => array(
              'id' => 'main-menu-links',
              'class' => array('links', 'clearfix'),
            ),
            'heading' => array(
              'text' => t('Main menu'),
              'level' => 'h2',
              'class' => array('element-invisible'),
            ),
          )); ?>
        </div>
        <?php print render($page['header']); ?>
      </div>
    </div>
    <!-- header ends here -->
    
    <!-- content starts -->
    <div id="content-wrapper" class="container_16">

      <div id="breadcrumb" class="grid_16"><?php print $breadcrumb; ?></div>

      <!-- main -->
      <div id="main" class="<?php print ($page['left'] && $page['right']) ? 'grid_8' : (($page['left'] || $page['right']) ? 'grid_12' : 'grid_16') ?>">
          
      
        <?php print render($title_prefix); ?>
        <?php if (!empty($title)): ?><h1 class="title" id="page-title"><?php print $title; ?></h1><?php endif; ?>
        <?php print render($title_suffix); ?>
        <?php if ($tabs): ?><div class="tabs"><?php print render($tabs); ?></div><?php endif; ?>
        <?php if (!empty($messages)): print $messages; endif; ?>
        <?php if (!empty($page['help'])): print render($page['help']); endif; ?>
        <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
        
        <div id="content-output"> 
          <?php print render($page['content']); ?>
        </div><!-- /#content-output -->
      </div>
      <!-- main ends here -->

      <!-- sidebars starts here -->
      <?php if ($page['left'] || $page['right']): ?>
      <div id="sidebars" class="<?php print ($page['left'] && $page['right']) ? 'grid_8' : 'grid_4' ?>">

        <!-- left sidebar starts here -->
        <?php if ($page['left']): ?>
        <div class="grid_4 alpha sidebar-left">
          <?php print render($page['left']); ?>
        </div>
        <?php endif; ?>
        <!-- left sidebar ends here -->

        <!-- right sidebar starts here -->
        <?php if ($page['right']): ?>
        <div class="grid_4 omega sidebar-right">
          <?php print render($page['right']); ?>
        </div>
        <?php endif; ?>
        <!-- right sidebar ends here -->

      </div>
      <?php endif; ?>
      <!-- sidebars end here -->

    </div>
    <!-- content ends here -->

    <!-- footer starts here -->
    <div id="footer-wrapper" class="container_16">

      <!-- footer top starts here -->
      <div id="footer-content">

        <!-- footer left starts here -->
        <div class="grid_8" id="footer-left">
          <?php print render($page['footer_left']); ?>
        </div>
        <!-- footer left ends here -->

        <!-- footer right starts here -->
        <div class="grid_8" id="footer-right">
          <?php print render($page['footer_right']); ?>
        </div>
        <!-- footer right ends here -->

      </div>
      <!-- footer top ends here -->

      <!-- footer bottom starts here -->
      <div id="footer-bottom">
        <div id="footer-meta" class="clear-block"> 
          <?php if ($secondary_menu): ?>
            <div id="secondary-menu" class="navigation">
              <?php print theme('links__system_secondary_menu', array(
                'links' => $secondary_menu,
                'attributes' => array(
                  'id' => 'secondary-menu-links',
                  'class' => array('links', 'inline', 'clearfix'),
                ),
                'heading' => array(
                  'text' => t('Secondary menu'),
                  'level' => 'h2',
                  'class' => array('element-invisible'),
                ),
              )); ?>
              </div> <!-- /#secondary-menu -->
            <?php endif; ?>
        </div>

        <?php if ($page['footer']): ?>
        <div id="footer-bottom-content">
          <?php print render($page['footer']); ?>
        </div>
        <?php endif; ?>
      </div>
      <!-- footer bottom ends here -->

    </div>
    <!-- footer ends here -->
