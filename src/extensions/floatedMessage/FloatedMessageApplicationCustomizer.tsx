import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import './style.css'


import * as strings from 'FloatedMessageApplicationCustomizerStrings';

const LOG_SOURCE: string = 'FloatedMessageApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFloatedMessageApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class FloatedMessageApplicationCustomizer
  extends BaseApplicationCustomizer<IFloatedMessageApplicationCustomizerProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    console.log("my extension")

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`).catch(() => {
    //   /* handle error */
    // });

    const INACTIVITY_TIME = 5 * 60 * 1000;
    let inactivityTimer: number;
    let timeRemaining = INACTIVITY_TIME;

    const parentElement = document.body;
    const dialogDiv = document.createElement('div');
    dialogDiv.id = 'dialog';
    dialogDiv.className = 'draggable';

    dialogDiv.innerHTML = `
    <div class="dialog-header">My dialog</div>
    <div class="dialog-content"><a href="https://www.google.com">Google...</a><br>
    <span id="timerSpan"></span>
    </div>
  `;
    parentElement.appendChild(dialogDiv);

    let isDragging = false;
    let offsetX: number, offsetY: number;

    const dialogHeader = dialogDiv.querySelector('.dialog-header');

    dialogHeader.addEventListener('mousedown', function (e: any) {
      isDragging = true;
      offsetX = e.clientX - dialogDiv.offsetLeft;
      offsetY = e.clientY - dialogDiv.offsetTop;
      document.addEventListener('mousemove', moveDialog);
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      document.removeEventListener('mousemove', moveDialog);
    });

    function moveDialog(e: any) {
      if (isDragging) {
        dialogDiv.style.left = (e.clientX - offsetX) + 'px';
        dialogDiv.style.top = (e.clientY - offsetY) + 'px';
      }
    }

    function setInactivityTimer() {
      clearTimeout(inactivityTimer);

      timeRemaining = INACTIVITY_TIME;

      inactivityTimer = setTimeout(function () {
        window.location.href = 'https://www.google.rs';
      }, INACTIVITY_TIME);
    }

    function formatTime(milliseconds: number) {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateTimerDisplay() {
      document.getElementById('timerSpan').innerText = `Time remaining: ${formatTime(timeRemaining)}`;
    }

    function startTimerUpdate() {
      setInterval(function () {
        timeRemaining -= 1000;
        updateTimerDisplay();
      }, 1000);
    }

    setInactivityTimer();
    updateTimerDisplay();
    startTimerUpdate();

    document.addEventListener('mousemove', function () {
      setInactivityTimer();
    });


    return Promise.resolve();
  }
}
