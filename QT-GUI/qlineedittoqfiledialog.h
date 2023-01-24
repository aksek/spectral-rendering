#ifndef QLINEEDITTOQFILEDIALOG_H
#define QLINEEDITTOQFILEDIALOG_H

#include <QLineEdit>

class QLineEditToQFileDialog : public QLineEdit
{
public:
    QLineEditToQFileDialog(QWidget*& widget);
    QLineEditToQFileDialog();

protected:
    void mousePressEvent(QMouseEvent* event);
};

#endif // QLINEEDITTOQFILEDIALOG_H
