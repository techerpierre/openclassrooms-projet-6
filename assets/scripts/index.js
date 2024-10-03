import { EditionBanner } from "./custom_elements/edition-banner.js"
import { ErrorModal } from "./custom_elements/error-modal.js"
import { File } from "./custom_elements/file.js"
import { Filter } from "./custom_elements/filter.js"
import { WorkCard, WorkEditor, WorkList } from "./custom_elements/work.js"

customElements.define(WorkCard.baliseName, WorkCard)
customElements.define(WorkList.baliseName, WorkList)
customElements.define(WorkEditor.baliseName, WorkEditor)
customElements.define(Filter.baliseName, Filter)
customElements.define(EditionBanner.baliseName, EditionBanner)
customElements.define(File.baliseName, File)
customElements.define(ErrorModal.baliseName, ErrorModal)
