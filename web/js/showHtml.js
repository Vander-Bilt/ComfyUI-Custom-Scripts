import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

app.registerExtension({
	name: "pysssss.ShowHtml",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData.name === "ShowHtml|pysssss") {
			console.log("ShowHtml|pysssss");
			function setHtml(html) {
				if (this.widgets) {
					const pos = this.widgets.findIndex((w) => w.name === "html_display" || w.name === "html_display_div");
					if (pos !== -1) {
						for (let i = pos; i < this.widgets.length; i++) {
							this.widgets[i].onRemove?.();
						}
						this.widgets.length = pos;
					}
				}

				const div = document.createElement("div");
				div.style.width = "100%";
				div.style.height = "auto";
				div.style.padding = "5px";
				div.style.color = "var(--input-text)";
				div.style.backgroundColor = "var(--comfy-input-bg)";
				div.style.borderRadius = "4px";
				div.style.margin = "5px 0";
				// div.style.maxHeight = "300px";
				div.style.overflowY = "auto";
				div.innerHTML = html;

				this.addDOMWidget("html_display_div", "div", div);

				const w = ComfyWidgets["STRING"](this, "html_display", ["STRING", { multiline: true }], app).widget;
				w.inputEl.readOnly = true;
				w.inputEl.style.display = "none";
				w.value = html;

				this.onResize?.(this.computeSize());
			}

			const onExecuted = nodeType.prototype.onExecuted;
			nodeType.prototype.onExecuted = function (message) {
				onExecuted?.apply(this, arguments);
				if (message?.html) {
					setHtml.call(this, message.html.join('\n'));
				}
			};

			const onConfigure = nodeType.prototype.onConfigure;
			nodeType.prototype.onConfigure = function () {
				onConfigure?.apply(this, arguments);
				if (this.widgets_values?.length && this.widgets_values[0]?.length) {
					setHtml.call(this, this.widgets_values[0].join('\n'));
				}
			};
		}
	},
});