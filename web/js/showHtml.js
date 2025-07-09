import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

// Displays input text on a node

// TODO: This should need to be so complicated. Refactor at some point.

import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

app.registerExtension({
	name: "pysssss.ShowHtml",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData.name === "ShowHtml|pysssss") {

			function setHtml(html) {
				if (this.widgets) {
					const pos = this.widgets.findIndex((w) => w.name === "html");
					if (pos !== -1) {
						for (let i = pos; i < this.widgets.length; i++) {
							this.widgets[i].onRemove?.();
						}
						this.widgets.length = pos;
					}
				}

				const w = ComfyWidgets["STRING"](this, "html", ["STRING", { multiline: true }], app).widget;
				w.inputEl.readOnly = true;
				w.inputEl.style.display = "none";

				const div = document.createElement("div");
				div.style.width = "100%";
				div.style.padding = "5px";
				div.style.color = "var(--input-text)";
				div.style.backgroundColor = "var(--comfy-input-bg)";
				div.style.borderRadius = "4px";
				div.style.margin = "5px 0";
				div.style.maxHeight = "300px";
				div.style.overflowY = "auto";
				div.innerHTML = html;
				w.inputEl.parentNode.insertBefore(div, w.inputEl);
				w.value = html;

				this.onResize?.(this.computeSize());
			}

			const onExecuted = nodeType.prototype.onExecuted;
			nodeType.prototype.onExecuted = function (message) {
				onExecuted?.apply(this, arguments);
				if (message?.html) {
					setHtml.call(this, message.html[0]);
				}
			};

			const onConfigure = nodeType.prototype.onConfigure;
			nodeType.prototype.onConfigure = function () {
				onConfigure?.apply(this, arguments);
				if (this.widgets_values?.length) {
					setHtml.call(this, this.widgets_values[0]);
				}
			};
		}
	},
});