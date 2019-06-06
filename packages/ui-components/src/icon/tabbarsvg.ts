import { Message } from '@phosphor/messaging';

import { h, VirtualElement } from '@phosphor/virtualdom';

import { TabBar } from '@phosphor/widgets';

import { iconKindType } from './icon';
import { defaultIconRegistry } from './iconregistry';

export class TabBarSvg<T> extends TabBar<T> {
  /**
   * Construct a new tab bar. Sets the (icon) kind and overrides
   * the default renderer.
   *
   * @param options - The options for initializing the tab bar.
   */
  constructor(
    options: { kind: iconKindType; skipbad?: boolean } & TabBar.IOptions<T>
  ) {
    options.renderer = options.renderer || TabBarSvg.defaultRenderer;
    super(options);

    this._kind = options.kind;
    this._skipbad = options.skipbad;
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);

    for (let itab in this.contentNode.children) {
      let tab = this.contentNode.children[itab];
      let title = this.titles[itab];
      let iconNode = tab.children ? (tab.children[0] as HTMLElement) : null;

      if (iconNode && iconNode.children.length < 1) {
        // add the svg node, if not already present
        defaultIconRegistry.icon({
          name: title.iconClass,
          container: iconNode,
          center: true,
          kind: this._kind,
          skipbad: this._skipbad
        });
      }
    }
  }

  protected _kind: iconKindType;
  protected _skipbad: boolean;
}

export namespace TabBarSvg {
  export class Renderer extends TabBar.Renderer {
    /**
     * Render the icon element for a tab. This version avoids clobbering
     * the icon node's children.
     *
     * @param data - The data to use for rendering the tab.
     *
     * @returns A virtual element representing the tab icon.
     */
    renderIcon(data: TabBar.IRenderData<any>): VirtualElement {
      let className = this.createIconClass(data);
      return h.div({ className });
    }
  }

  export const defaultRenderer = new Renderer();
}
