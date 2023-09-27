# Link gabber that works for you

Chrome extension to collect and make accessable all links from pages you vist.

## WIP

Current progress - we have a structure to gather static and onClick links, as well as detector for mutators to analize for sneakier links. Everything goes to console right now - UI is only to reset data and trigger a full analysis.

## Current Structure

An on load that captures mutators, an injection script to trigger a full page analysis, and a manager to keep everything together across the entire browser session. Also the supporting UI files.

## ToDo

* Better dynamic link analysis - in all forms.  
  * All the links are belong to us.
* User interface - would be nice to see the data and interact with it outside of debug...
* Sort links by types
  * Domain
  * Outside Domain (content links)
  * Badvertisements
