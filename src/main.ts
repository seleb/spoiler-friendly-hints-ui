import { saveAs } from 'file-saver';
import { convert } from 'spoiler-friendly-hints';

export async function main() {
	const elInput = document.querySelector<HTMLTextAreaElement>('#input');
	const elColorText = document.querySelector<HTMLInputElement>('#colorText');
	const elColorBg = document.querySelector<HTMLInputElement>('#colorBg');
	const elColorAccent =
		document.querySelector<HTMLInputElement>('#colorAccent');
	const elHighlight = document.querySelector<HTMLInputElement>('#highlight');
	const elPreamble = document.querySelector<HTMLInputElement>('#preamble');
	const elTitle = document.querySelector<HTMLInputElement>('#title');
	const elUrl = document.querySelector<HTMLInputElement>('#url');
	const elPreview = document.querySelector<HTMLIFrameElement>('#preview');
	const elAutoupdate = document.querySelector<HTMLInputElement>('#autoupdate');
	const elUpdate = document.querySelector<HTMLButtonElement>('#update');
	const elDownload = document.querySelector<HTMLButtonElement>('#download');

	if (
		!elInput ||
		!elPreview ||
		!elColorText ||
		!elColorBg ||
		!elColorAccent ||
		!elHighlight ||
		!elPreamble ||
		!elTitle ||
		!elUrl ||
		!elAutoupdate ||
		!elUpdate ||
		!elDownload
	)
		throw new Error('could not find elements');

	const convertWithOptions = () =>
		convert(elInput.value, {
			preamble: elPreamble.checked,
			title: elTitle.value,
			preambleUrl: elUrl.value,
			colorAccent: elColorAccent.value,
			colorBg: elColorBg.value,
			colorText: elColorText.value,
			indent: /(^\s*)(.*$)/,
			highlight: new RegExp(RegExp.escape(elHighlight.value)),
		});

	const updateOutput = () => {
		const htmlOutput = convertWithOptions();
		elPreview.srcdoc = htmlOutput;
	};

	[
		elInput,
		elColorAccent,
		elColorBg,
		elColorText,
		elHighlight,
		elPreamble,
		elTitle,
		elUrl,
	].forEach((i) =>
		i.addEventListener('input', () => elAutoupdate.checked && updateOutput())
	);

	elInput.value =
		elInput.value ||
		`hints
 Did you check under the sofa?
  It's not there.
 Did you check by the entrance?
  It's not there.
 Did you check inside the bathroom?
  Did you shut the door after you?
   !!! Did you check every surface?
    It's in the bathroom, behind the door, on the back wall.`;

	updateOutput();

	elUpdate.addEventListener('click', updateOutput);

	elDownload.addEventListener('click', () => {
		saveAs(
			new Blob([convertWithOptions()], { type: 'text/html' }),
			'hints.html'
		);
	});
}
