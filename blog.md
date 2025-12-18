---
layout: page
title: Blog
permalink: /blog/
order: 1
---
<h1>Aquí comparto mis pensamientos y tutoriales 📜</h1>

<ul>
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