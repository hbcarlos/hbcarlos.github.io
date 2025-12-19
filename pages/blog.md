---
layout: page
title: Blog
title_header: Aquí comparto mis pensamientos y tutoriales 📜
permalink: /blog/
---

<ul class="clean-list">
  {% for post in site.posts %}
    <li>
      <h3>
        <a class="post-link" href="{{ post.url | relative_url }}">
          {{ post.title | escape }}
        </a>
      </h3>
	  <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      {% if post.description %}
        <p>{{ post.description }}</p>
      {% else %}
         {{ post.excerpt }}
      {% endif %}
    </li>
  {% endfor %}
</ul>