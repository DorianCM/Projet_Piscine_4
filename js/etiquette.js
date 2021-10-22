let a = document.getElementsByClassName("text");

//RESIZE CODE BY @mandy.michael

const box = document.getElementById("t1");
const text = document.getElementById("text1");

function resizeBox() {
    calcTextWidth();
    calcTextSize();
}
resizeBox();

function calcTextWidth() {
    const parentContainerWidth = box.clientWidth;

    const currentTextWidth = text.scrollWidth;
    const currentFontStretch = parseInt(window.getComputedStyle(text).fontStretch);


    console.log('parent: ' + parentContainerWidth + ' textwidth: ' + currentTextWidth + ' stretch: ' +currentFontStretch);
    const newValue = Math.min(Math.max(300, (parentContainerWidth / currentTextWidth) * currentFontStretch), 500);

    text.style.setProperty('--fontStretch', newValue + '%');
}

function calcTextSize() {
    const parentContainerWidth = box.clientWidth;
    const currentTextWidth = text.scrollWidth;
    const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
    const newValue = Math.min(Math.max(16, (parentContainerWidth / currentTextWidth) * currentFontSize), 500);

    text.style.setProperty('--fontSize', newValue +'px');
}