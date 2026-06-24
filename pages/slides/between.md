---
layout: slides
title: "Carlos Herrero - Fullstack Developer Python & React"
permalink: /slides/presentation_between/
sitemap: false
noindex: true
---

# Carlos Herrero

<div class="columns">
<div markdown="1">
![Carlos Herrero](/assets/img/carlos_small.jpg)
</div>

<div markdown="1">
Software Engineer passionate about Open Source and its ability to bridge the digital divide and promote tech inclusion. Recognized as a [Project Jupyter Distinguished Contributor](https://jupyter.org/about#2022-cohort) for this dedication.
</div>
</div>

---

# Introduction

* My impact at the Project Jupyter as a QuantStack employee
* How we added Real-Time Collaboration
  * The Software Engineering
  * The Social Engineering
* Other projects I worked on at Jupyter
* Jupyverse

---

# Project Jupyter

[![Jupyter Project](/assets/between/project_header.png)](https://jupyter.org)

My main focus was on JupyterLab with significant [pull requests](https://github.com/jupyterlab/jupyterlab/pulls?q=is%3Apr+author%3Ahbcarlos+is%3Aclosed+sort%3Acreated-asc) over multiple years.

---

# Real-Time Collaboration

[![RTC](/assets/between/shared_cursors.png)](https://mybinder.org/v2/gist/hbcarlos/a44ad9258f7ea9c21e7fa04d84fc41a9/HEAD?urlpath=lab)

---

# Real-Time Collaboration

<div class="columns">
<div markdown="1">

[**Kevin Jahns**](https://github.com/dmonad)

* Author of the [Yjs](https://yjs.dev), a CRDT (conflict-free replicated data type) implementation
* We hired him to implement shared editing on JupyterLab

</div>

<div markdown="1">

**My initial job on RTC**
* Onboard Kevin at the Jupyter Project
* show him the source code, resolve questions about JupyterLab and
* learn about RTC, Yjs, CRDTs and his implemtation on JupyterLab
* to take over the project

</div>
</div>

![yjs](/assets/between/logo_tool.svg)

---

# Real-Time Collaboration

<div class="columns">
<div markdown="1">

**Initial implementation**
* [[WIP] Collaborative editing using Yjs](https://github.com/jupyterlab/jupyterlab/pull/9785)
* I implemente the echo WebSocket endpoint

**Automerge**
* Eric Charles and Pierre-Olivier Simonard
* They were using Automerge (Another CRDT implementation)
* [Jupyterlab/rtc](https://github.com/jupyterlab/rtc/)

</div>

<div markdown="1">

**Joint effort**
* Initial PR for Real-Time Collaboration by Kevin with help from Eric Charles and me
* [Shared editing with collaborative notebook model](https://github.com/jupyterlab/jupyterlab/pull/10118)
* We got some push back from users because it had some bugs
* The first user opening the document loaded the content from disk.
* We could not make breaking changes to the API in Lab v3.6

</div>
</div>

---

# Real-Time Collaboration

<div class="columns">
<div markdown="1">

**Move to an extension**
* We couldn't move fast because it was on JupyterLab core
* I created [JupyterLab-collaboration](https://github.com/jupyterlab/jupyter-collaboration)
* We could break things and iterate faster
* We mainly worked on the backend
* Created [YDocuments](https://github.com/jupyter-server/jupyter_ydoc) (A python representation of the document)
* Load the content at the server side
* Propagate the content to every user

</div>

<div markdown="1">

**RTC extensions**
* [JupyterCAD](https://github.com/jupytercad/JupyterCAD)
  * a JupyterLab extension for collaborative 3D CAD modeling
  * using Open Cascade (compiled to WebAssembly) for the geometry kernel and Three.js for rendering
* [JupyterLab-DrawIO](https://github.com/QuantStack/jupyterlab-drawio)
  * A JupyterLab extension for embedding drawio / mxgraph.

</div>
</div>

---

# Real-Time Collaboration

<iframe width="640" height="360"
  src="https://www.youtube.com/embed/CoZ3Sg--JLk"
  title="YouTube video player" frameborder="0"
  allow="acceleropackeometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>

---

# [Voila-GridStack](https://github.com/voila-dashboards/voila-gridstack)

Dashboard template for Voilà, to easily rearenge notebook cells in the dashboard.

![Voila-gridstack](/assets/between/dashboard.gif)

---

# [JupyterLab-Blockly](https://github.com/QuantStack/jupyterlab-blockly)

Blockly is a library from Google for building beginner-friendly block-based programming languages

[![blockly](/assets/between/overwies.gif)](https://jupyterlab-blockly.readthedocs.io/en/latest/lite/lab/index.html?path=example.jpblockly)

---

# [Glue-JupyterLab](https://github.com/QuantStack/glue-jupyterlab)

An extension to bring the data exploration tool Glue to the cloud.

![glue](/assets/between/exploration.gif)

---

# [JupyterLab LSP migration](https://github.com/jupyterlab/jupyterlab/pull/14920)

Coding assistance for JupyterLab (code navigation + hover suggestions + linters + autocompletion + rename) using Language Server Protocol

![lsp](/assets/between/image_4.gif)

---

# [Jupyverse](https://github.com/jupyter-server/jupyverse)

* A modern Jupyter server implemente using FastAPI
* Designed around RBAC (Role-based access control) from the begining
* Where we could experiment freely with collaborative editing capabillities