#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

    # >>>>> added from here
    if use_ptvsd():
        if (os.environ.get('RUN_MAIN') or os.environ.get('WERKZEUG_RUN_MAIN')) or \
            os.environ.get('SHELL_WITH_PTVSD'):
            import ptvsd
            ptvsd.enable_attach(address=('0.0.0.0', 8888))
            print(os.environ.get('RUN_MAIN'))
            print(os.environ.get('WERKZEUG_RUN_MAIN'))
            print(os.environ.get('SHELL_WITH_PTVSD'))
            print('NOTICE: Attach ptvsd')
    # <<<<< added to here

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


def use_ptvsd():
    print(os.environ.get('USE_PTVSD'))
    return os.environ.get('USE_PTVSD') == 'TRUE'


if __name__ == '__main__':
    main()
