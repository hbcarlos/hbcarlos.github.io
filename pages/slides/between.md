---
layout: slides
title: "Carlos Herrero — Real-Time Collaboration in Project Jupyter"
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

* My work at Project Jupyter as a QuantStack employee
* How we added Real-Time Collaboration
  * My role on the project
  * The Software Engineering
  * The Social Engineering
* Other projects I worked on at Jupyter
* Jupyverse
  * A modern jupyter server with FastAPI

---

# Project Jupyter

[![Jupyter Project](/assets/between/project_header.png)](https://jupyter.org)

During my carrer at QuantStack, my main focus was on JupyterLab, with significant [pull requests](https://github.com/jupyterlab/jupyterlab/pulls?q=is%3Apr+author%3Ahbcarlos+is%3Aclosed+sort%3Acreated-asc) over multiple years.

---

# Real-Time Collaboration
### Shared editing in JupyterLab

[![RTC](/assets/between/shared_cursors.png)](https://mybinder.org/v2/gist/hbcarlos/a44ad9258f7ea9c21e7fa04d84fc41a9/HEAD?urlpath=lab)

---

# Real-Time Collaboration
### The team

<div class="columns">
<div markdown="1">

[**Kevin Jahns**](https://github.com/dmonad)

* Author of [Yjs](https://yjs.dev), a CRDT (conflict-free replicated data type) implementation
* We hired him to implement shared editing in JupyterLab

</div>

<div markdown="1">

**My initial work on RTC**

* Onboard Kevin onto Project Jupyter
* Walk him through the JupyterLab source and answer his questions
* Learn RTC, Yjs, CRDTs and his implementation
* Eventually take over the project

</div>
</div>

![yjs](/assets/between/logo_tool.svg)

---

# Real-Time Collaboration
### Two competing approaches

<div class="columns">
<div markdown="1">

**Yjs — initial implementation**

* [[WIP] Collaborative editing using Yjs](https://github.com/jupyterlab/jupyterlab/pull/9785)
* I implemented the echo WebSocket endpoint

</div>

<div markdown="1">

**Automerge — a parallel effort**

* By Eric Charles and Pierre-Olivier Simonard
* Used Automerge, another CRDT implementation
* [jupyterlab/rtc](https://github.com/jupyterlab/rtc/)

</div>
</div>

---

# Real-Time Collaboration
### Joint effort & the hard bugs

* Initial PR for Real-Time Collaboration by Kevin, with help from Eric Charles and me
* [Shared editing with collaborative notebook model](https://github.com/jupyterlab/jupyterlab/pull/10118)
* We got some pushback from users because of early bugs
  * Only the first user to open a document loaded its content from disk — late joiners could see stale state
  * We could not make breaking API changes in JupyterLab v3.6

---

# Real-Time Collaboration
### Moving to an extension

<div class="columns">
<div markdown="1">

* In JupyterLab core we couldn't iterate fast enough
* I created [jupyter-collaboration](https://github.com/jupyterlab/jupyter-collaboration)
* We could break things and iterate faster, mostly on the backend
* Created [jupyter_ydoc](https://github.com/jupyter-server/jupyter_ydoc) — a Python (pycrdt) representation of the documents
* The server loads the content and propagates it to every user

</div>

<div markdown="1">

**Extensions built on this foundation**

* [JupyterCAD](https://github.com/jupytercad/JupyterCAD)
  * Collaborative 3D CAD modeling in JupyterLab
  * OpenCascade.js (WebAssembly) for the geometry kernel, Three.js for rendering
* [JupyterLab-DrawIO](https://github.com/QuantStack/jupyterlab-drawio)
  * Embedding drawio / mxgraph in JupyterLab

</div>
</div>

---

# Real-Time Collaboration
### The result

<iframe width="640" height="360"
  src="https://www.youtube.com/embed/CoZ3Sg--JLk"
  title="YouTube video player" frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>

---

# Real-Time Collaboration
### Where it is today

* RTC is now the **default** collaboration framework in JupyterLab 4
* `jupyter-collaboration` and `jupyter_ydoc` are official Jupyter packages
* The same foundation powers [JupyterCAD](https://github.com/jupytercad/JupyterCAD), [JupyterGIS](https://github.com/geojupyter/jupytergis) and JupyterLab-DrawIO
* `pycrdt` is now the shared Python CRDT layer across the ecosystem

---

# The Social Engineering

Adding RTC was as much about people as about code:

* **Onboarding** Kevin Jahns onto Project Jupyter
* **Bridging two rival approaches** (Yjs and Automerge) into a single joint effort
* **Moving the work out of core** into an extension so we could iterate without breaking users
* **Building consensus** across QuantStack, the original authors and the community

---

# Other projects at Jupyter

---

# [Voila-GridStack](https://github.com/voila-dashboards/voila-gridstack)

A Voilà dashboard template that lets you rearrange notebook cells into a dashboard via drag-and-drop. I also wrote the [Dashboarding with JupyterLab 3](https://blog.jupyter.org/dashboarding-with-jupyterlab-3-789fcb1a5857) post about it.

![Voila-gridstack](/assets/between/dashboard.gif)

---

# [JupyterLab-Blockly](https://github.com/QuantStack/jupyterlab-blockly)

Blockly is a Google library for building beginner-friendly, block-based programming languages.

[![blockly](/assets/between/overwies.gif)](https://jupyterlab-blockly.readthedocs.io/en/latest/lite/lab/index.html?path=example.jpblockly)

---

# [Glue-JupyterLab](https://github.com/QuantStack/glue-jupyterlab)

An extension that brings the Glue data-exploration tool into JupyterLab.

![glue](/assets/between/exploration.gif)

---

# [JupyterLab LSP migration](https://github.com/jupyterlab/jupyterlab/pull/14920)

Coding assistance for JupyterLab (code navigation + hover suggestions + linters + autocompletion + rename) using the Language Server Protocol.

![lsp](/assets/between/image_4.gif)

---

# [Jupyverse](https://github.com/jupyter-server/jupyverse)

* A modern Jupyter server built with FastAPI
* Designed around RBAC (Role-Based Access Control) from the beginning
* A place where we could experiment freely with collaborative editing capabilities

---

# Thank you

* GitHub — [@hbcarlos](https://github.com/hbcarlos)
