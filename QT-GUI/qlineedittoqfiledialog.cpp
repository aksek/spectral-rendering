#include "qlineedittoqfiledialog.h"
#include <QFileDialog>
#include <QStringList>

QLineEditToQFileDialog::QLineEditToQFileDialog(QWidget *&widget) : QLineEdit(widget)
{

}

QLineEditToQFileDialog::QLineEditToQFileDialog()
{

}

void QLineEditToQFileDialog::mousePressEvent(QMouseEvent *event)
{
    QFileDialog dialog(this);
    dialog.setFileMode(QFileDialog::ExistingFile);
    dialog.setNameFilter(tr("WaveFront obj (*.obj)"));
    if (dialog.exec())
    {
        auto fileName = dialog.selectedFiles()[0];
        setText(fileName);
    }
    else
    {
        setText("Wybierz plik...");
    }
}
