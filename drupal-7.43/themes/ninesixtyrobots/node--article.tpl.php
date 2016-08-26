
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <?php print render($title_prefix); ?>
  <?php if (!$page): ?>
    <h2<?php print $title_attributes; ?>>
      <a href="<?php print $node_url; ?>"><?php print $title; ?></a>
    </h2>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  
  <div class="meta post-info">
  <?php if ($display_submitted): ?>
    <span class="submitted">
      Posted by: <?php print $name; ?>
    </span>
  <?php endif; ?>

  <?php if ($tags = render($content['field_tags'])): ?>
    | Filed under: <span class="terms terms-inline"><?php print $tags; ?></span>
  <?php endif;?>
  </div>

  <div class="content clearfix"<?php print $content_attributes; ?>>
    <div class="dateblock">
      <span class="month"><?php print $date_month ?></span>
      <span class="day"><?php print $date_day ?></span>
      <span class="year"><?php print $date_year ?></span>
    </div>
    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      print render($content);
    ?>
  </div>

  <?php
    // Remove the "Add new comment" link on the teaser page or if the comment
    // form is being displayed on the same page.
    if ($teaser || !empty($content['comments']['comment_form'])) {
      unset($content['links']['comment']['#links']['comment-add']);
    }
    // Only display the wrapper div if there are links.
    $links = render($content['links']);
    if ($links):
  ?>
    <div class="link-wrapper postmeta">
      <?php print $links; ?>
    </div>
  <?php endif; ?>

  <?php print render($content['comments']); ?>

</div>
