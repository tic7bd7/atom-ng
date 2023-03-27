const { Disposable } = require('atom');
const etch = require('etch');
const { shell } = require('electron');
const AtomLogo = require('./atom-logo');
const EtchComponent = require('../etch-component');
const UpdateView = require('./update-view');

const $ = etch.dom;

module.exports = class AboutView extends EtchComponent {
  handleAtomVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentAtomVersion);
  }

  handleElectronVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentElectronVersion);
  }

  handleChromeVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentChromeVersion);
  }

  handleNodeVersionClick(e) {
    e.preventDefault();
    atom.clipboard.write(this.props.currentNodeVersion);
  }

  handleReleaseNotesClick(e) {
    e.preventDefault();
    shell.openExternal(
      this.props.updateManager.getReleaseNotesURLForAvailableVersion()
    );
  }

  handleLicenseClick(e) {
    e.preventDefault();
    atom.commands.dispatch(
      atom.views.getView(atom.workspace),
      'application:open-license'
    );
  }

  handleTermsOfUseClick(e) {
    e.preventDefault();
    shell.openExternal('https://docs.github.com/articles/github-terms-of-service');
  }

  handleHowToUpdateClick(e) {
    e.preventDefault();
    shell.openExternal(
      'https://web.archive.org/web/20221201143209/https://flight-manual.atom.io/getting-started/sections/installing-atom/'
    );
  }

  handleShowMoreClick(e) {
    e.preventDefault();
    var showMoreDiv = document.querySelector('.show-more');
    var showMoreText = document.querySelector('.about-more-expand');
    switch (showMoreText.textContent) {
      case 'Show more':
        showMoreDiv.classList.toggle('hidden');
        showMoreText.textContent = 'Hide';
        break;
      case 'Hide':
        showMoreDiv.classList.toggle('hidden');
        showMoreText.textContent = 'Show more';
        break;
    }
  }

  handleShowYiffClick(e) {
    e.preventDefault();
    var showYiffDiv = document.querySelector('.show-yiff');
    var showYiffText = document.querySelector('.about-yiff-expand');
    switch (showYiffText.textContent) {
      case 'Show naughty stuffz':
        showYiffDiv.classList.toggle('hide');
        showYiffText.textContent = 'Hide naughty stuffz';
        break;
      case 'Hide naughty stuffz':
        showYiffDiv.classList.toggle('hide');
        showYiffText.textContent = 'Show naughty stuffz';
        break;
    }
  }

  render() {
    return $.div(
      { className: 'pane-item native-key-bindings about' },
      $.div(
        { className: 'about-container' },
        $.header(
          { className: 'about-header' },
          $.a(
            { className: 'about-atom-io', title: 'Atom-ng Banner', href: 'https://thorium.rocks/atom-ng/' },
            $(AtomLogo)
          ),
          $.div(
            { className: 'about-header-info' },
            $.span(
              {
                className: 'about-version-container inline-block atom',
                onclick: this.handleAtomVersionClick.bind(this)
              },
              $.span(
                { className: 'about-version' },
                `${this.props.currentAtomVersion} ${process.arch}`
              ),
              $.span({ className: 'icon icon-clippy about-copy-version' })
            ),
            $.a(
              {
                className: 'about-header-release-notes',
                onclick: this.handleReleaseNotesClick.bind(this)
              },
              'Release Notes'
            )
          ),
          $.span(
            {
              className:
                'about-version-container inline-block show-more-expand',
              onclick: this.handleShowMoreClick.bind(this)
            },
            $.span({ className: 'about-more-expand' }, 'Show more')
          ),
          $.div(
            { className: 'show-more hidden about-more-info' },
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block electron',
                  onclick: this.handleElectronVersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Electron: ${this.props.currentElectronVersion} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block chrome',
                  onclick: this.handleChromeVersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Chrome: ${this.props.currentChromeVersion} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version' })
              )
            ),
            $.div(
              { className: 'about-more-info' },
              $.span(
                {
                  className: 'about-version-container inline-block node',
                  onclick: this.handleNodeVersionClick.bind(this)
                },
                $.span(
                  { className: 'about-more-version' },
                  `Node: ${this.props.currentNodeVersion} `
                ),
                $.span({ className: 'icon icon-clippy about-copy-version' })
              )
            )
          )
        )
      ),

      $(UpdateView, {
        updateManager: this.props.updateManager,
        availableVersion: this.props.availableVersion,
        viewUpdateReleaseNotes: this.handleReleaseNotesClick.bind(this),
        viewUpdateInstructions: this.handleHowToUpdateClick.bind(this)
      }),

      $.div(
        { className: 'about-actions group-item' },
        $.div(
          { className: 'btn-group' },
          $.button(
            {
              className: 'btn view-license',
              onclick: this.handleLicenseClick.bind(this)
            },
            'License'
          ),
          $.button(
            {
              className: 'btn terms-of-use',
              onclick: this.handleTermsOfUseClick.bind(this)
            },
            'Terms of Use'
          )
        )
      ),

      $.div(
        { className: 'about-love group-start' },
        $.span({ className: 'icon icon-code' }),
        $.span({ className: 'inline' }, ' with '),
        $.span({ className: 'icon icon-heart' }),
        $.span({ className: 'inline' }, ' by '),
        $.a(
          { className: 'author', title: 'Author' },
          { href: 'https://github.com/Alex313031/' },
          'Alex313031'
        )
      ),

      $.div(
        { className: 'about-credits group-item' },
        $.span({ className: 'inline' }, 'And with care by '),
        $.a({ className: 'icon icon-logo-github', title: 'GitHub Homepage', href: 'https://github.com' })
      ),

      $.div(
        { className: 'about-yiff group-item', onclick: this.handleShowYiffClick.bind(this) },
        $.span({ className: 'inline about-yiff-expand' }, 'Show naughty stuffz'),
        $.div({ className: 'yiff hide show-yiff', title: "Roxy's Upskirt" })
      )      
    );
  }

  serialize() {
    return {
      deserializer: this.constructor.name,
      uri: this.props.uri
    };
  }

  onDidChangeTitle() {
    return new Disposable();
  }

  onDidChangeModified() {
    return new Disposable();
  }

  getTitle() {
    return 'About';
  }

  getIconName() {
    return 'info';
  }
};
