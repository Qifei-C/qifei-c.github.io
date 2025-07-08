---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

{% include base_path %}

## Open Source Projects

This section presents a collection of my open-source projects, originating from academic coursework and independent development. **To maintain academic integrity**, solutions to past assignments have either been omitted or replaced with pseudocode and output demonstrations, where appropriate.

<div class="grid__wrapper">
  {% assign sorted_projects = site.projects | sort: 'date' | reverse %}
  {% for post in sorted_projects %}
    <div class="grid__item">
      <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
        <h2 class="archive__item-title" itemprop="headline">
          {% if post.github %}
            <a href="{{ post.github }}" target="_blank" rel="noopener noreferrer">{{ post.title }}</a>
            <a href="{{ post.github }}" target="_blank" rel="noopener noreferrer" style="margin-left: 0.5em;">
              <i class="fab fa-github" aria-hidden="true"></i>
            </a>
          {% else %}
            {{ post.title }}
          {% endif %}
        </h2>
        {% if post.excerpt %}
          <p class="archive__item-excerpt" itemprop="description">{{ post.excerpt | markdownify | strip_html | truncate: 200 }}</p>
        {% endif %}
        {% if post.tags %}
          <p class="archive__item-tags">
            {% for tag in post.tags %}
              <span class="archive__item-tag">{{ tag }}</span>
            {% endfor %}
          </p>
        {% endif %}
      </article>
    </div>
  {% endfor %}
</div>

<style>
.archive__item-tag {
  display: inline-block;
  padding: 0.2em 0.5em;
  margin: 0.2em;
  font-size: 0.8em;
  background-color: var(--global-tag-color);
  border-radius: 3px;
}
</style>
