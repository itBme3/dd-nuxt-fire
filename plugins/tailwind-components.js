import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import {
  TInput, TButton, TTag, TModal, TTextarea, TInputGroup, TCheckbox,
  TCheckboxGroup, TRadio, TRadioGroup, TSelect, TRichSelect, TDropdown, TToggle
} from 'vue-tailwind/dist/components'

export const TailwindComponentsSettings = {
  gInput: {
    component: TInput,
    props: {
      fixedClasses:
        'hover:shadow-lg rounded active:shadow-md focus:shadow-md block w-full px-3 py-2 transition border border-gray-700 border-opacity-10 duration-100 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ring-non outline-none focus:border-0 focus:outline-none focus:ring-0, active:border-0 active:outline-none active:ring-0',
      classes: 'placeholder-gray-400 dark:placeholder-gray-600 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800',
      placeholder: '...',
      variants: {
        dark: 'bg-gray-800 hover:bg-gray-700 active:bg-gray-700 focus:bg-gray-700 text-gray-100 placeholder-gray-300',
        header: 'bg-gray-800 bg-opacity-50 w-full py-2 px-3 hover:bg-opacity-100 active:bg-opacity-100 hover:shadow-lg active:shadow-md focus:shadow-sm text-gray-100 placeholder-gray-600'
      }
    }
  },
  gTextarea: {
    component: TTextarea,
    props: {
      fixedClasses: 'block w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 ',
      variants: {
        danger: 'border-red-300 bg-red-50 placeholder-red-200 text-red-900',
        success: 'border-green-300 bg-green-50 placeholder-gray-400 text-green-900'
      }
    }
  },
  gCheckbox: {
    component: TCheckbox,
    props: {
      fixedClasses: 'transition duration-100 ease-in-out rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-blue-500 border-gray-300 ',
      variants: {
        error: 'text-red-500 border-red-300',
        success: 'text-green-500 border-green-300'
      }
    }
  },
  gCheckboxGroup: {
    component: TCheckboxGroup,
    props: {
      classes: {
        groupWrapper: 'flex flex-col',
        label: 'ml-2 text-gray-700 uppercase text-sm',
        input: 'transition duration-100 ease-in-out rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed text-blue-500 border-gray-300'
      },
      variants: {
        danger: {
          groupWrapper: 'flex flex-col',
          label: 'ml-2 text-red-500 uppercase text-sm',
          input: 'transition duration-100 ease-in-out rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed text-red-500 border-red-500'
        },
        buttons: {
          groupWrapper: 'flex',
          label: '',
          labelChecked: '',
          wrapper: 'mx-1 bg-white border border-gray-300 flex items-center px-4 py-2 rounded shadow-sm cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          wrapperChecked: 'mx-1 bg-gray-100 border border-gray-300 flex items-center px-4 py-2 rounded shadow-inner cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          inputWrapper: '',
          inputWrapperChecked: '',
          input: 'absolute invisible'
        }
      }
    }
  },
  gRadio: {
    component: TRadio,
    props: {
      fixedClasses: 'transition duration-100 ease-in-out shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-blue-500 border-gray-300',
      variants: {
        error: 'text-red-500 border-red-300',
        success: 'text-green-500 border-green-300'
      }
    }
  },
  gRadioGroup: {
    component: TRadioGroup,
    props: {
      classes: {
        groupWrapper: 'flex flex-col',
        label: 'ml-2 text-gray-700 uppercase text-sm',
        input: 'text-blue-500 transition duration-100 ease-in-out border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
      },
      variants: {
        danger: {
          groupWrapper: 'flex flex-col',
          label: 'ml-2 text-red-500 uppercase text-sm',
          input: 'text-red-500 transition duration-100 ease-in-out border-red-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
        },
        buttons: {
          groupWrapper: 'flex',
          label: '',
          labelChecked: '',
          wrapper: 'mx-1 bg-white border border-gray-300 flex items-center px-4 py-2 rounded shadow-sm cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          wrapperChecked: 'mx-1 bg-gray-100 border border-gray-300 flex items-center px-4 py-2 rounded shadow-inner cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          inputWrapper: '',
          inputWrapperChecked: '',
          input: 'absolute invisible'
        }
      }
    }
  },
  gSelect: {
    component: TSelect,
    props: {
      fixedClasses: 'block w-full pl-3 pr-10 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 ',
      variants: {
        danger: 'border-red-300 bg-red-50 placeholder-red-200 text-red-900',
        success: 'border-green-300 bg-green-50 placeholder-gray-400 text-green-900'
      }
    }
  },
  gRichSelect: {
    component: TRichSelect,
    props: {
      fixedClasses: {
        wrapper: 'relative',
        buttonWrapper: 'inline-block relative w-full',
        selectButton: 'w-full flex text-left justify-between items-center px-3 py-2 text-black transition duration-100 ease-in-out border rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        selectButtonLabel: 'block truncate',
        selectButtonPlaceholder: 'block truncate',
        selectButtonIcon: 'fill-current flex-shrink-0 ml-1 h-4 w-4',
        selectButtonClearButton: 'rounded flex flex-shrink-0 items-center justify-center absolute right-0 top-0 m-2 h-6 w-6 transition duration-100 ease-in-out',
        selectButtonClearIcon: 'fill-current h-3 w-3',
        dropdown: 'absolute w-full z-10 -mt-1 absolute border-b border-l border-r rounded-b shadow-sm z-10',
        dropdownFeedback: '',
        loadingMoreResults: '',
        optionsList: 'overflow-auto',
        searchWrapper: 'inline-block w-full',
        searchBox: 'inline-block w-full',
        optgroup: '',
        option: 'cursor-pointer',
        disabledOption: 'opacity-50 cursor-not-allowed',
        highlightedOption: 'cursor-pointer',
        selectedOption: 'cursor-pointer',
        selectedHighlightedOption: 'cursor-pointer',
        optionContent: '',
        optionLabel: 'truncate block',
        selectedIcon: 'fill-current h-4 w-4',
        enterClass: '',
        enterActiveClass: '',
        enterToClass: '',
        leaveClass: '',
        leaveActiveClass: '',
        leaveToClass: ''
      },
      classes: {
        wrapper: '',
        buttonWrapper: '',
        selectButton: 'bg-white border-gray-300',
        selectButtonLabel: '',
        selectButtonPlaceholder: 'text-gray-400',
        selectButtonIcon: 'text-gray-600',
        selectButtonClearButton: 'hover:bg-blue-100 text-gray-600',
        selectButtonClearIcon: '',
        dropdown: 'bg-white border-gray-300',
        dropdownFeedback: 'pb-2 px-3 text-gray-400 text-sm',
        loadingMoreResults: 'pb-2 px-3 text-gray-400 text-sm',
        optionsList: '',
        searchWrapper: 'p-2 placeholder-gray-400',
        searchBox: 'px-3 py-2 bg-gray-50 text-sm rounded border focus:outline-none focus:shadow-outline border-gray-300',
        optgroup: 'text-gray-400 uppercase text-xs py-1 px-2 font-semibold',
        option: '',
        disabledOption: '',
        highlightedOption: 'bg-blue-100',
        selectedOption: 'font-semibold bg-gray-100 bg-blue-500 font-semibold text-white',
        selectedHighlightedOption: 'font-semibold bg-gray-100 bg-blue-600 font-semibold text-white',
        optionContent: 'flex justify-between items-center px-3 py-2',
        optionLabel: '',
        selectedIcon: '',
        enterClass: 'opacity-0',
        enterActiveClass: 'transition ease-out duration-100',
        enterToClass: 'opacity-100',
        leaveClass: 'opacity-100',
        leaveActiveClass: 'transition ease-in duration-75',
        leaveToClass: 'opacity-0'
      },
      variants: {
        danger: {
          selectButton: 'border-red-300 bg-red-50 text-red-900',
          selectButtonPlaceholder: 'text-red-200',
          selectButtonIcon: 'text-red-500',
          selectButtonClearButton: 'hover:bg-red-200 text-red-500',
          dropdown: 'bg-red-50 border-red-300'
        },
        success: {
          selectButton: 'border-green-300 bg-green-50 text-green-900',
          selectButtonIcon: 'text-green-500',
          selectButtonClearButton: 'hover:bg-green-200 text-green-500',
          dropdown: 'bg-green-50 border-green-300'
        }
      }
    }
  },
  gDropdown: {
    component: TDropdown,
    props: {
      fixedClasses: {
        button: 'flex items-center text-white block px-4 py-2 transition duration-100 ease-in-out border border-transparent rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        wrapper: 'inline-flex flex-col',
        dropdownWrapper: 'relative z-10',
        dropdown: 'origin-top-left absolute left-0 w-56 rounded shadow mt-1',
        enterClass: 'opacity-0 scale-95',
        enterActiveClass: 'transition transform ease-out duration-100',
        enterToClass: 'opacity-100 scale-100',
        leaveClass: 'opacity-100 scale-100',
        leaveActiveClass: 'transition transform ease-in duration-75',
        leaveToClass: 'opacity-0 scale-95'
      },
      classes: {
        button: 'bg-blue-500 hover:bg-blue-600',
        dropdown: 'bg-white'
      },
      variants: {
        danger: {
          button: 'bg-red-500 hover:bg-red-600',
          dropdown: 'bg-red-50'
        }
      }
    }
  },
  gToggle: {
    component: TToggle,
    props: {
      fixedClasses: {
        wrapper: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200',
        wrapperChecked: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200  border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        wrapperDisabled: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200 opacity-50 cursor-not-allowed',
        wrapperCheckedDisabled: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200 opacity-50 cursor-not-allowed border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        button: 'inline-block absolute transform translate-x-0 transition ease-in-out duration-200',
        buttonChecked: 'inline-block absolute transform translate-x-full transition ease-in-out duration-200',
        checkedPlaceholder: 'inline-block',
        uncheckedPlaceholder: 'inline-block'
      },
      classes: {
        wrapper: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        wrapperChecked: 'bg-blue-500 rounded-full',
        wrapperDisabled: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        wrapperCheckedDisabled: 'bg-blue-500',
        button: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-gray-400 text-xs',
        buttonChecked: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-blue-500 text-xs',
        checkedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
        uncheckedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs'
      },
      variants: {
        danger: {
          wrapperChecked: 'bg-red-500 rounded-full',
          wrapperCheckedDisabled: 'bg-red-500 rounded-full'
        },
        success: {
          wrapperChecked: 'bg-green-500 rounded-full',
          wrapperCheckedDisabled: 'bg-green-500 rounded-full'
        },
        box: {
          wrapper: 'bg-gray-100 rounded-sm border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          wrapperChecked: 'bg-blue-500 rounded-sm',
          wrapperCheckedDisabled: 'bg-blue-500 rounded-sm',
          button: 'h-6 w-6 rounded-sm bg-white shadow flex items-center justify-center text-gray-400 text-xs',
          buttonChecked: 'h-6 w-6 rounded-sm  bg-white shadow flex items-center justify-center text-blue-500 text-xs',
          checkedPlaceholder: 'rounded-sm w-6 h-6 flex items-center justify-center text-gray-400 text-xs',
          uncheckedPlaceholder: 'rounded-sm w-6 h-6 flex items-center justify-center text-gray-400 text-xs'
        }
      }
    }
  },
  gInputGroup: {
    component: TInputGroup,
    props: {
      fixedClasses: {
        wrapper: '',
        label: 'block',
        body: '',
        feedback: ' text-sm text-sm',
        description: 'text-gray-400 text-sm'
      },
      classes: {
        wrapper: '',
        label: '',
        body: '',
        feedback: 'text-gray-400',
        description: 'text-gray-400'
      },
      variants: {
        danger: {
          label: 'text-red-500',
          feedback: 'text-red-500'
        },
        success: {
          label: 'text-green-500',
          feedback: 'text-green-500'
        }
      }
    }
  },
  gButton: {
    component: TButton,
    props: {
      fixedClasses: 'button transition focus:border-transparent focus:ring-0 focus:outline-0 disabled:opacity-50 disabled:cursor-not-allowed',
      classes: '',
      variants: {}
    }
  },
  gTag: {
    component: TTag,
    props: {
      fixedClasses: '',
      classes: '',
      variants: {
        title: 'text-2xl leading-8 font-extrabold text-gray-900 tracking-tight',
        subtitle: 'text-lg leading-6 font-medium text-gray-900',
        error: 'text-red-500',
        badge: 'inline-flex items-center px-3 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800',
        avatar: 'inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500 overflow-hidden leading-none text-center'
      }
    }
  },
  gModal: {
    component: TModal,
    props: {
      fixedClasses: {
        overlay: 'z-9999 overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed',
        wrapper: 'relative mx-auto z-99999 m-6',
        modal: 'overflow-visible relative  rounded',
        body: 'p-3',
        header: 'border-b p-3 rounded-t',
        footer: ' p-3 rounded-b',
        close: 'flex items-center justify-center transition duration-100 ease-in-out focus:ring-0 focus:ring-transparent focus:outline-none z-999',
        closeIcon: 'fill-current h-6 w-6'
      },
      classes: {
        overlay: 'bg-gray-800 bg-opacity-90',
        wrapper: 'max-w-lg mt-8 md:mt-6',
        modal: 'bg-transparent',
        header: 'border-gray-100',
        footer: 'bg-gray-100',
        close: 'rounded-md shadow-xl absolute right-0 top-0 h-12 w-12 bg-gray-300 bg-opacity-5 hover:bg-gray-300 hover:bg-opacity-10 text-red-400',
        overlayEnterClass: 'opacity-0',
        overlayEnterActiveClass: 'transition ease-out duration-100',
        overlayEnterToClass: 'opacity-100',
        overlayLeaveClass: 'opacity-100',
        overlayLeaveActiveClass: 'transition ease-in duration-75',
        overlayLeaveToClass: 'opacity-0',
      },
      variants: {
        pdf: {
          wrapper: 'h-full',
          modal: 'bg-transparent lg:px-12 shadow-none h-[calc(100vh-2em)] w-full mx-auto max-w-[1280px]',
          body: 'p-0 h-full',
          header: 'border-gray-100',
          footer: 'bg-gray-100',
          close: 'fixed rounded-sm w-8 sm:w-12 h-8 sm:h-12 top-1 right-1 bg-gray-700 bg-opacity-0 hover:bg-opacity-30 text-red-400',
          closeIcon: 'w-6 h-6 sm:w-8 sm:h-8',
          overlayEnterClass: 'opacity-0',
          overlayEnterActiveClass: 'transition ease-out duration-100',
          overlayEnterToClass: 'opacity-100',
          overlayLeaveClass: 'opacity-100',
          overlayLeaveActiveClass: 'transition ease-in duration-75',
          overlayLeaveToClass: 'opacity-0',
        }
      }
    }
  }
}

Vue.use(VueTailwind, TailwindComponentsSettings)
export default TailwindComponentsSettings
