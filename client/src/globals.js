import { createElement, Component } from "@wordpress/element";
import 'whatwg-fetch';
import { isString } from "lodash";
import { apiRequest } from './api-request';
import './api-request';
import { __ } from '@wordpress/i18n';

window.wp = window.wp || {};

// Necessary for the pragma config
// Component is used by the Dashicon component
window.wp.element = { createElement, Component };

// Necessary for wp.date
window._wpDateSettings = {
  l10n: {
    locale: "fr_FR",
    months: [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre"
    ],
    monthsShort: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc"
    ],
    weekdays: [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi"
    ],
    weekdaysShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    meridiem: { am: " ", pm: " ", AM: " ", PM: " " },
    relative: { future: "%s à partir de maintenant", past: "Il y a %s" }
  },
  formats: {
    time: "G \\h i \\m\\i\\n",
    date: "j F Y",
    datetime: "j F Y G \\h i \\m\\i\\n"
  },
  timezone: { offset: 1, string: "Europe/Paris" }
};

window.cloudinaryImage = (url, width = 636, height = 358, crop = 'fill', effect = null, quality = 'auto', gravity = 'auto') => {
    if (!url) {
        return undefined;
    }

    // Build up the options
    const options = [
        `h_${height}`,
        `w_${width}`,
        `c_${crop}`,
        `q_${quality}`,
    ];
    if (gravity) {
        options.push(`g_${gravity}`);
    }

    return url.replace('/upload/', '/upload/' + options + '/').replace('http:', 'https:');
};

// User settings used to persist store caches
window.userSettings = { uid: "dummy" };

// API globals
window.wpApiSettings = {
  schema: {}
};

window.wp.api = {
  getPostTypeRoute() {
    return "none";
  }
};

window.wp.__ = __;
