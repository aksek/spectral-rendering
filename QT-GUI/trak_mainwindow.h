#ifndef TRAK_MAINWINDOW_H
#define TRAK_MAINWINDOW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui { class TRAK_MainWindow; }
QT_END_NAMESPACE

class TRAK_MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    TRAK_MainWindow(QWidget *parent = nullptr);
    ~TRAK_MainWindow();

private slots:
    void on_pushButton_released();

    void on_NumOfReflectionsSlider_valueChanged(int value);

    void on_color_400_valueSlider_valueChanged(int value);

    void on_color_430_valueSlider_valueChanged(int value);

    void on_color_460_valueSlider_valueChanged(int value);

    void on_color_490_valueSlider_valueChanged(int value);

    void on_color_520_valueSlider_valueChanged(int value);

    void on_color_550_valueSlider_valueChanged(int value);

    void on_color_580_valueSlider_valueChanged(int value);

    void on_color_610_valueSlider_valueChanged(int value);

    void on_color_640_valueSlider_valueChanged(int value);

    void on_color_670_valueSlider_valueChanged(int value);

    void on_binningCheckBox_stateChanged(int arg1);

private:
    Ui::TRAK_MainWindow *ui;

    QString sliderValueToQString(int value);
    void showBinningTable();
    void showNonBinningTable();
    void toggleBinningTable(bool show);

    QString getBinningParameterString();
    QString getReflectionsNumParameterString();
    QString getLightColorParameterString();
    QString prepareSystemCallCommand(QString& binning, QString& reflectionsNum, QString& lightColor);
};
#endif // TRAK_MAINWINDOW_H
