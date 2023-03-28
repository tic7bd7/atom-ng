import { CompositeDisposable, Emitter } from 'atom';
import * as Helpers from './helpers';
let manifest;
function formatItem(item) {
    let itemName;
    if (item && typeof item === 'object' && typeof item.name === 'string') {
        itemName = item.name;
    }
    else if (typeof item === 'string') {
        itemName = item;
    }
    else {
        throw new Error('Unknown object passed to formatItem()');
    }
    return `  - ${itemName}`;
}
function sortByName(item1, item2) {
    return item1.name.localeCompare(item2.name);
}
export class Commands {
    constructor() {
        this.emitter = new Emitter();
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(this.emitter, atom.commands.add('atom-workspace', {
            'linter:enable-linter': () => this.enableLinter(),
            'linter:disable-linter': () => this.disableLinter(),
        }), atom.commands.add('atom-text-editor:not([mini])', {
            'linter:lint': () => this.lint(),
            'linter:debug': () => this.debug(),
            'linter:toggle-active-editor': () => this.toggleActiveEditor(),
        }));
    }
    lint() {
        this.emitter.emit('should-lint');
    }
    debug() {
        this.emitter.emit('should-debug');
    }
    enableLinter() {
        this.emitter.emit('should-toggle-linter', 'enable');
    }
    disableLinter() {
        this.emitter.emit('should-toggle-linter', 'disable');
    }
    toggleActiveEditor() {
        this.emitter.emit('should-toggle-active-editor');
    }
    onShouldLint(callback) {
        return this.emitter.on('should-lint', callback);
    }
    onShouldDebug(callback) {
        return this.emitter.on('should-debug', callback);
    }
    onShouldToggleActiveEditor(callback) {
        return this.emitter.on('should-toggle-active-editor', callback);
    }
    onShouldToggleLinter(callback) {
        return this.emitter.on('should-toggle-linter', callback);
    }
    dispose() {
        this.subscriptions.dispose();
    }
}
export async function showDebug(standardLinters, indieLinters, uiProviders) {
    if (!manifest) {
        manifest = require('../package.json');
    }
    const textEditor = atom.workspace.getActiveTextEditor();
    if (textEditor === undefined) {
        return;
    }
    const textEditorScopes = Helpers.getEditorCursorScopes(textEditor);
    const sortedLinters = standardLinters.slice().sort(sortByName);
    const sortedIndieLinters = indieLinters.slice().sort(sortByName);
    const sortedUIProviders = uiProviders.slice().sort(sortByName);
    const indieLinterNames = sortedIndieLinters.map(formatItem).join('\n');
    const standardLinterNames = sortedLinters.map(formatItem).join('\n');
    const matchingStandardLinters = sortedLinters
        .filter(linter => Helpers.shouldTriggerLinter(linter, false, textEditorScopes))
        .map(formatItem)
        .join('\n');
    const humanizedScopes = textEditorScopes.map(formatItem).join('\n');
    const uiProviderNames = sortedUIProviders.map(formatItem).join('\n');
    const ignoreGlob = atom.config.get('linter.ignoreGlob');
    const ignoreVCSIgnoredPaths = atom.config.get('core.excludeVcsIgnoredPaths');
    const disabledLinters = atom.config.get('linter.disabledProviders').map(formatItem).join('\n');
    const filePathIgnored = await Helpers.isPathIgnored(textEditor.getPath(), ignoreGlob, ignoreVCSIgnoredPaths);
    atom.notifications.addInfo('Linter Debug Info', {
        detail: [
            `Platform: ${process.platform}`,
            `Atom Version: ${atom.getVersion()}`,
            `Linter Version: ${manifest.version}`,
            `Opened file is ignored: ${filePathIgnored ? 'Yes' : 'No'}`,
            `Matching Linter Providers: \n${matchingStandardLinters}`,
            `Disabled Linter Providers: \n${disabledLinters}`,
            `Standard Linter Providers: \n${standardLinterNames}`,
            `Indie Linter Providers: \n${indieLinterNames}`,
            `UI Providers: \n${uiProviderNames}`,
            `Ignore Glob: ${ignoreGlob}`,
            `VCS Ignored Paths are excluded: ${ignoreVCSIgnoredPaths}`,
            `Current File Scopes: \n${humanizedScopes}`,
        ].join('\n'),
        dismissable: true,
    });
}
//# sourceMappingURL=commands.js.map