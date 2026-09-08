---
title: This Website
tags: Web Development
banner: ../../assets/banners/website-banner.png
techStack: HTML, CSS, Javascript
status: Completed
repo: https://github.com/aaliah-bfb/web-portfolio/tree/main
description: A portfolio website built to showcase my learning journey, skills, projects and experience.
---


## Design
When designing this portfolio, I knew it needed a layout and colour palette that felt unmistakably me. I used Adobe Illustrator to draft some initial designs and explore different layout ideas. After experimenting with different combinations using [coolors](https://coolors.co), I eventually settled on a palette that felt exactly like what I was looking for.
![colour palette](../../../assets/images/colour-palette.png)

## Approach: 'Vanilla' Web Development
I wanted this site to remain light-weight and easy to maintain, so I chose to build it using plain HTML, CSS and JavaScript.

For the content, such as blog posts and write-ups, I decided to use Markdown files instead of hardcoding each page in HTML. Each `.md` file contains a metadata section at the top, which is parsed using string splitting in additional JavaScript scripts. This means that adding a new post/project is as simple as creating a new Markdown file rather than duplicating an existing HTML template.

I also wanted to further utilise my design skills by incorporating custom themes and responsive layouts. Rather than maintaining separate stylesheets for light and dark mode, I defined the colour palette using CSS variables, which are swapped out when dark mode is toggled. I then worked through each page individually to make the layouts flexible across different screen sizes.

<video src="../../../assets/videos/features.mp4" autoplay loop muted playsinline></video>

<hr>

## Hosting the Website on Github Pages with a Cloudflare Domain
When researching how to host the website using Github pages, I found plenty of comprehensive tutorials from Github covering individual parts of the process, however, many of these guides were nested within one another. I found that I was struggling to find one centralised, straight-forward resource, that wasn't a video tutorial or a forum post focused on troubleshooting. To make this process easier for whoever may use this as a guide, here is how I hosted this website:

1. Create a repository for the code, and upload it.
2. Go to **Settings → Pages** in the repository.
3. Select **"Deploy from a branch"** for Source, and select the branch that the code is sitting on.

### DNS Setup in Cloudflare
4. In Cloudflare, go to **DNS → Records** and add the following:
    - **Four A records** for the root domain (Name: `@`), pointing to Github Pages' IPs so the traffic is spread across them instead of relying on one:
        - `185.199.108.153`
        - `185.199.109.153`
        - `185.199.110.153`
        - `185.199.111.153`
    - **One CNAME record** for **`www`** pointing to `yourusername.github.io`.
    - Set all records to **"DNS Only"** (grey cloud, not proxied). Reasoning: Github needs to see the DNS records directly to verify domain ownership.
    > A records map a domain directly to an IP address, which is required at the root/apex domain (`yourdomain.com`, no `www`). Github is stricter about seeing real A records at the apex instead of just a CNAME.
5. Back in the repository, go to **Settings → Pages** and enter the custom domain in the **"Custom Domain"** field, then save. This creates a `CNAME` file in the repository that tells Github which domain to serve the site on.

### Disabling Jekyll Processing (optional)
6. This step is only required if using `.md` files as content fetched directly by JavaScript. In the repository root, create an empty file called `.nojekyll`. 

    > By default, Github Pages uses Jekyll to process contents of the repository when deploying the site. Jekyll is a static site generator that converts Markdown files into HTML as part of the build process. This website, however, does not use Jekyll for templating, and instead fetches `.md` files directly using JavaScript and renders the content client-side. Without a `.nojekyll` file, Github Pages runs the repository through Jekyll, converting the Markdown files and causing fetch requests to return a 404, since the files no longer existed at their original paths. Adding a `.nojekyll` file tells Github Pages to skip the Jekyll build, keeping the Markdown files accessible in their original form.

### Enforcing HTTPS
7. Wait for the DNS to propagate (in **Settings → Pages**) and for Github to confirm the domain check has passed. This can take anywhere from a few minutes to 24 hours, but worked in a couple minutes for me.
8. Once available, check the **"Enforce HTTPS"** box. 

### www -> Apex Redirect
9. In Cloudflare, go to **Rules → Page Rules**.
10. Add `www.[domain name].com/*` to the URL field.
11. Under settings, choose **"Forwarding URL"** and status code **"301 - Permanent Redirect"**.
12. Enter `https://[domain name]/$1` as the destination URL, then save and deploy.
> This ensures visitors who land on the `www` version of the domain get permanently redirected to the apex (non-www) version.

<hr>

That's how this website was built! It has combined my interests in design and software development into something that I can continue to build on.
I’m looking forward to developing the site alongside my skills, studies and career, and seeing where it takes me!