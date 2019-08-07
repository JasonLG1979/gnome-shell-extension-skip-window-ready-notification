/*
 * Skip Window Ready Notification extension for Gnome Shell 3.32+
 * Copyright 2019 Jason Gray (JasonLG1979)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * If this extension breaks your desktop you get to keep all of the pieces...
 */
"use strict";

const Main = imports.ui.main;
const AttentionHandler = Main.windowAttentionHandler;
const DefaultDemandsAttention = AttentionHandler._onWindowDemandsAttention;

function enable() {
    if (!connectNewHandlers(skipNotification)) {
        throw new Error('The signal handler ids required for this extension to function are not present.');
    }
}

function disable() {
    connectNewHandlers(DefaultDemandsAttention);
}

function connectNewHandlers(func) {
    if (AttentionHandler.hasOwnProperty('_windowDemandsAttentionId')
        && AttentionHandler._windowDemandsAttentionId
        && AttentionHandler.hasOwnProperty('_windowMarkedUrgentId')
        && AttentionHandler._windowMarkedUrgentId) {
        global.display.disconnect(AttentionHandler._windowDemandsAttentionId);
        global.display.disconnect(AttentionHandler._windowMarkedUrgentId);
        AttentionHandler._windowDemandsAttentionId = global.display.connect(
            'window-demands-attention',
            (display, window) => {
                func(display, window);
            }
        );
        AttentionHandler._windowMarkedUrgentId = global.display.connect(
            'window-marked-urgent',
            (display, window) => {
                func(display, window);
            }
        );
        return true;
    }
    return false;
}

function skipNotification(display, window) {
    if (window && !window.has_focus() && !window.is_skip_taskbar()) {
        Main.activateWindow(window);
    }
}
