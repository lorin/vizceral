/**
 *
 *  Copyright 2016 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
import _ from 'lodash';
import THREE from 'three';

class BaseView {
  constructor (object) {
    this.container = new THREE.Object3D();
    this.container.userData.object = this.object;
    this.object = object;
    this.interactiveChildren = [];
    this.dimmedLevel = 0.2;
    this.opacity = 1.0;
    this.dimmed = false;

    this.meshes = {};
  }

  addInteractiveChild (child) {
    child.userData.object = this.object;
    this.interactiveChildren.push(child);
  }

  addInteractiveChildren (children) {
    _.each(children, child => this.addInteractiveChild(child));
  }

  getInteractiveChildren () {
    return this.interactiveChildren;
  }

  invalidateInteractiveChildren () {
    this.interactiveChildren = undefined;
  }

  createCanvas (width, height) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    this.resizeCanvas(canvas, width, height);
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    return canvas;
  }

  resizeCanvas (canvas, width, height) {
    const context = canvas.getContext('2d');

    // Store the context information we care about
    const font = context.font;
    const textAlign = context.textAlign;
    const textBaseline = context.textBaseline;

    const ratio = 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = `${width} px`;
    canvas.style.height = `${height} px`;

    // When a canvas is resized, it loses context, so reset it here
    context.font = font;
    context.textAlign = textAlign;
    context.textBaseline = textBaseline;

    context.scale(ratio, ratio);
  }

  setOpacity (opacity) {
    this.opacity = opacity;
  }

  setDimPercent (percent) {
    this.setOpacity(1 - (percent * (1 - this.dimmedLevel)));
  }

  refreshFocused () {
  }

  setDimmed (dimmed, dimmingApplied) {
    const focused = !dimmed && dimmingApplied;
    if (focused !== this.focused) {
      this.focused = focused;
      this.refreshFocused();
    }

    if (dimmed !== this.dimmed) {
      this.dimmed = dimmed;
      this.updatePosition(true);
      return true;
    }
    return false;
  }

  addChildElement (geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    this.container.add(mesh);
    this.addInteractiveChild(mesh);
    return mesh;
  }
}

export default BaseView;
